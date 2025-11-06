
import { CardData } from '../types';

// Declare external libraries loaded via CDN
declare const jspdf: any;
declare const html2canvas: any;

/**
 * Generates a PDF from the presentation slides currently rendered in the DOM.
 * It uses html2canvas to capture each slide as a high-resolution image,
 * ensuring the PDF is a 100% exact replica of the web view, formatted for A4 landscape printing.
 */
export const generatePdfFromSlides = async (
  topic: string,
  onProgress: (progress: { message: string; percentage: number }) => void
): Promise<void> => {
  const slideElements = document.querySelectorAll<HTMLElement>('.presentation-slide');
  if (slideElements.length === 0) {
    throw new Error("No presentation slides found to capture.");
  }
  
  onProgress({ message: 'Initializing...', percentage: 0 });

  // @ts-ignore (using CDN)
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4', // Set standard A4 paper size
  });
  
  const PDF_WIDTH = pdf.internal.pageSize.getWidth();
  const PDF_HEIGHT = pdf.internal.pageSize.getHeight();

  for (let i = 0; i < slideElements.length; i++) {
    const slide = slideElements[i];
    
    const percentage = Math.round(((i) / slideElements.length) * 100);
    onProgress({ message: `Slide ${i + 1} of ${slideElements.length}`, percentage });

    // Store original inline style to restore it later.
    const originalStyle = slide.style.cssText;

    let canvas;
    try {
      // Temporarily override styles for a clean snapshot, removing any UI-specific decorations.
      // This prevents shadows, borders, and margins from appearing in the captured image.
      slide.style.boxShadow = 'none';
      slide.style.border = 'none';
      slide.style.borderRadius = '0';
      slide.style.margin = '0';
      
      // Use html2canvas to capture the DOM element.
      // A higher scale factor (e.g., 3) results in a higher-resolution image.
      canvas = await html2canvas(slide, {
        scale: 3, 
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff', // Slides have a white background
      });
    } finally {
        // Restore the original inline style completely to not affect the web view.
        slide.style.cssText = originalStyle;
    }

    // Get the image data from the canvas as a JPEG for efficiency.
    const imageData = canvas.toDataURL('image/jpeg', 0.95);

    // For all pages after the first, add a new A4 landscape page.
    if (i > 0) {
      pdf.addPage('a4', 'landscape');
    }

    // --- Aspect Ratio Preservation Logic ---
    // Calculate the aspect ratios of the canvas and the PDF page.
    const canvasAspectRatio = canvas.width / canvas.height;
    const pdfAspectRatio = PDF_WIDTH / PDF_HEIGHT;

    let finalWidth, finalHeight, x, y;

    // Determine the best fit to "contain" the image within the PDF page,
    // just like `background-size: contain` in CSS.
    if (canvasAspectRatio > pdfAspectRatio) {
      // If the canvas is wider than the PDF page's aspect ratio, fit to width.
      finalWidth = PDF_WIDTH;
      finalHeight = PDF_WIDTH / canvasAspectRatio;
      x = 0;
      y = (PDF_HEIGHT - finalHeight) / 2; // Center vertically.
    } else {
      // If the canvas is taller or equal, fit to height.
      finalHeight = PDF_HEIGHT;
      finalWidth = PDF_HEIGHT * canvasAspectRatio;
      x = (PDF_WIDTH - finalWidth) / 2; // Center horizontally.
      y = 0;
    }

    // Add the captured image to the PDF, using the calculated dimensions
    // to preserve the aspect ratio and prevent stretching.
    pdf.addImage(imageData, 'JPEG', x, y, finalWidth, finalHeight);
  }
  
  onProgress({ message: 'Finalizing...', percentage: 100 });

  // Format the topic to get the first word, lowercase, and alphanumeric.
  const oneWordTopic = topic.trim().split(' ')[0].toLowerCase().replace(/[^a-z0-9]/gi, '') || 'presentation';
  const fileName = `${oneWordTopic}@MySlides.pdf`;
  
  pdf.save(fileName);
};