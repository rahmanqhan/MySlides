import React, { ReactNode } from 'react';

// --- SPACING CONTROLS ---
// Adjust the numbers below to precisely control the vertical spacing between elements.
// The values are in 'em' units, which are relative to the surrounding text's font size,
// ensuring the spacing scales correctly on all screen sizes.

const SPACING_CONFIG = {
  /**
   * Controls the gap directly BELOW the main slide title (<h1>).
   * A smaller number brings the content below it closer to the title.
   * Original value was 0.6.
   */
  TITLE_BOTTOM_MARGIN_EM: 0.1,

  /**
   * Controls the gap directly ABOVE a large heading (<h2>).
   * A smaller number brings it closer to the element above it (e.g., the title).
   * Original value was 1.6.
   */
  HEADING_2_TOP_MARGIN_EM: 0.6,

  /**
   * Controls the gap directly ABOVE a sub-heading (<h3>).
   * Original value was 1.2.
   */
  HEADING_3_TOP_MARGIN_EM: 0.6,
  
  /**
   * Controls the gap directly ABOVE a paragraph (<p>).
   */
  PARAGRAPH_TOP_MARGIN_EM: 1.6,

  /**
   * Controls the gap directly ABOVE a bulleted list (<ul>).
   * A smaller number brings the list closer to the element above it.
   */
  LIST_TOP_MARGIN_EM: 0.8,
};
// --- END OF SPACING CONTROLS ---

interface MarkdownRendererProps {
  title: string;
  content: string;
}

// Helper to parse inline markdown for **bold** and *italic* text.
const parseInlineMarkdown = (line: string): ReactNode => {
    // The regex splits the string by bold or italic markdown, keeping the delimiters.
    const segments = line.split(/(\*\*.*?\*\*|\*.*?\*)/g).filter(Boolean);

    return (
        <>
            {segments.map((segment, index) => {
                if (segment.startsWith('**') && segment.endsWith('**')) {
                    // Render a plain <strong> tag, to be styled by parent `prose` class.
                    return <strong key={index}>{segment.slice(2, -2)}</strong>;
                }
                if (segment.startsWith('*') && segment.endsWith('*')) {
                    // Render a plain <em> tag.
                    return <em key={index}>{segment.slice(1, -1)}</em>;
                }
                // It's a plain text segment.
                return segment;
            })}
        </>
    );
};


const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ title, content }) => {
    const renderContent = () => {
        // Pre-process content to fix common AI formatting errors.
        // This ensures headings are always treated as block elements by adding newlines around them.
        const processedContent = content
            .replace(/(##{2,3} .*)/g, '\n\n$1\n\n') // Wrap all headings with newlines
            .replace(/\n{3,}/g, '\n\n') // Collapse 3+ newlines into 2
            .trim();

        const elements: ReactNode[] = [];
        let listItems: string[] = [];
        const lines = processedContent.split('\n');

        // This function renders any accumulated list items into a <ul> element.
        const flushList = () => {
            if (listItems.length > 0) {
                elements.push(
                    <ul key={`ul-${elements.length}`} style={{ marginTop: `${SPACING_CONFIG.LIST_TOP_MARGIN_EM}em` }} className="space-y-[0.8em]">
                        {listItems.map((item, idx) => (
                            <li key={idx} className="text-[1.5em] relative pl-[1.2em]">
                                {/* Custom bullet point using absolute positioning for perfect alignment. */}
                                <span style={{ top: '0.55em' }} className="absolute left-0 w-[0.4em] h-[0.4em] bg-current rounded-full"></span>
                                {parseInlineMarkdown(item)}
                            </li>
                        ))}
                    </ul>
                );
                listItems = [];
            }
        };

        lines.forEach((line, index) => {
            const trimmedLine = line.trim();
            
            // Order of checks is important: ### -> ## -> #
            if (trimmedLine.startsWith('###')) {
                flushList();
                elements.push(<h3 key={index} className="text-[1.8em] font-semibold" style={{ marginTop: `${SPACING_CONFIG.HEADING_3_TOP_MARGIN_EM}em` }}>{parseInlineMarkdown(trimmedLine.substring(3).trim())}</h3>);
            } else if (trimmedLine.startsWith('##')) {
                flushList();
                elements.push(<h2 key={index} className="text-[2.2em] font-bold" style={{ marginTop: `${SPACING_CONFIG.HEADING_2_TOP_MARGIN_EM}em` }}>{parseInlineMarkdown(trimmedLine.substring(2).trim())}</h2>);
            } else if (trimmedLine.startsWith('#')) {
                flushList();
                // Treat single hash as h2 to avoid duplicate h1 with the main slide title
                elements.push(<h2 key={index} className="text-[2.2em] font-bold" style={{ marginTop: `${SPACING_CONFIG.HEADING_2_TOP_MARGIN_EM}em` }}>{parseInlineMarkdown(trimmedLine.substring(1).trim())}</h2>);
            } else if (trimmedLine.startsWith('* ') || trimmedLine.startsWith('- ')) {
                // A space after the marker is required to be a list item
                listItems.push(trimmedLine.substring(2).trim());
            } else if (trimmedLine !== '') {
                flushList();
                elements.push(<p key={index} className="text-[1.5em]" style={{ marginTop: `${SPACING_CONFIG.PARAGRAPH_TOP_MARGIN_EM}em` }}>{parseInlineMarkdown(trimmedLine)}</p>);
            } else {
                // An empty line flushes the current list, creating a break.
                flushList();
            }
        });

        // After the loop, flush any remaining list items.
        flushList();

        // Remove top margin from the very first element to prevent unwanted space after the title.
        // This makes our "margin-top-only" spacing model work seamlessly.
        if (elements.length > 0) {
            const firstElement = elements[0];
            // FIX: Use React.isValidElement as a type guard to safely narrow the type of
            // firstElement from ReactNode to ReactElement. This correctly informs TypeScript
            // that .props is a valid property, resolving the 'unknown' type errors.
            if (React.isValidElement(firstElement)) {
                // Fix: Cast props to a known type with an optional `style` property. This is necessary because
                // TypeScript treats the props of a generic React element as 'unknown' in strict mode,
                // which prevents direct property access and spreading.
                const props = firstElement.props as { style?: React.CSSProperties; [key: string]: any };
                if (props.style?.marginTop) {
                    const newProps = { ...props, style: { ...props.style, marginTop: 0 }};
                    elements[0] = React.cloneElement(firstElement, newProps);
                }
            }
        }

        return elements;
    };

    // Clean the title to remove any markdown characters like #, *, etc., from anywhere in the string.
    const cleanedTitle = title.replace(/[#*]/g, '').trim();

    return (
        // The parent `div` has no class, the `h1` maintains its specific styling.
        // The rest of the elements are plain and will be styled by the `prose` wrapper in `Slide.tsx`.
        <div>
            <h1 className="text-[2.8em] font-extrabold" style={{ marginBottom: `${SPACING_CONFIG.TITLE_BOTTOM_MARGIN_EM}em` }}>{cleanedTitle}</h1>
            {renderContent()}
        </div>
    );
};

export default MarkdownRenderer;