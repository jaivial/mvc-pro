import dynamic from 'next/dynamic';

const DynamicPDFViewer = dynamic(() => import('@react-pdf/renderer').then(mod => mod.PDFViewer), {
    ssr: false
});

export default DynamicPDFViewer;
