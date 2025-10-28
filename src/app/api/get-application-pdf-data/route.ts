import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';
import PDFDocument from 'pdfkit';
import getStream from 'get-stream';
import { PassThrough } from 'stream'; // Import PassThrough

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const applicationId = searchParams.get('applicationId');

  if (!applicationId) {
    return NextResponse.json({ error: 'Application ID is required' }, { status: 400 });
  }

  try {
    const applicationRef = db
      .collection('applications')
      .where('applicationIdDisplay', '==', applicationId)
      .limit(1);
    const snapshot = await applicationRef.get();

    if (snapshot.empty) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    const data = snapshot.docs[0].data();

    // Generate a PDF
    const doc = new PDFDocument();

    // Create a PassThrough stream to pipe the PDFDocument output
    const stream = new PassThrough();
    doc.pipe(stream); // Pipe the PDF document content to the stream

    doc.fontSize(18).text(`Permit Data for ${applicationId}`, { align: 'center' });
    doc.moveDown();

    Object.entries(data).forEach(([key, value]) => {
      doc.fontSize(12).text(`${key}: ${value}`);
    });

    doc.end(); // Finalize the PDF document

    // Convert the PassThrough stream to a Buffer using get-stream
    const pdfBuffer = await getStream.buffer(stream); // Use the PassThrough stream here

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="permit_${applicationId}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error fetching application:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
