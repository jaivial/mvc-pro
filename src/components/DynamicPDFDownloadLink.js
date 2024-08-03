import dynamic from 'next/dynamic';

const DynamicPDFDownloadLink = dynamic(() => import('@react-pdf/renderer').then(mod => mod.PDFDownloadLink), {
    ssr: false
});

export default DynamicPDFDownloadLink;
