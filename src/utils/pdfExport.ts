// src/utils/pdfExport.ts (альтернативная версия)
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const exportPlanToPDF = async (elementId: string, title: string) => {
    const element = document.getElementById(elementId);
    if (!element) return;

    try {
        const canvas = await html2canvas(element, {
            scale: 2,
            backgroundColor: '#ffffff',
            logging: false,
            useCORS: true
        });

        const imgData = canvas.toDataURL('image/png');
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        const imgWidth = 190;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        let heightLeft = imgHeight;
        let position = 0;
        let page = 1;

        doc.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= 280; // высота страницы в мм минус отступы

        while (heightLeft > 0) {
            position = heightLeft - imgHeight;
            doc.addPage();
            doc.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
            heightLeft -= 280;
            page++;
        }

        doc.save(`${title.replace(/[^a-zа-яё0-9]/gi, '_')}.pdf`);
    } catch (error) {
        console.error('Ошибка при создании PDF:', error);
    }
};