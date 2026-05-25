package com.softgrowtech.service;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;
import com.itextpdf.text.pdf.draw.LineSeparator;
import com.softgrowtech.model.Submission;
import org.springframework.stereotype.Service;
import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

@Service
public class PdfReceiptService {
    private static final BaseColor CYAN = new BaseColor(0, 229, 255);
    private static final BaseColor DARK = new BaseColor(5, 13, 26);
    private static final BaseColor GRAY = new BaseColor(136, 146, 176);
    private static final DateTimeFormatter FMT = DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a");

    public byte[] generateReceipt(Submission sub) {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            Document doc = new Document(PageSize.A4, 50, 50, 50, 50);
            PdfWriter.getInstance(doc, baos);
            doc.open();
            Font titleFont = new Font(Font.FontFamily.HELVETICA, 22, Font.BOLD, CYAN);
            Font headerFont = new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD, BaseColor.WHITE);
            Font bodyFont = new Font(Font.FontFamily.HELVETICA, 10, Font.NORMAL, GRAY);
            Font valueFont = new Font(Font.FontFamily.HELVETICA, 10, Font.NORMAL, BaseColor.WHITE);
            Paragraph title = new Paragraph("SoftGrowTech", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            doc.add(title);
            Paragraph sub1 = new Paragraph("Internship Portal - Submission Receipt", bodyFont);
            sub1.setAlignment(Element.ALIGN_CENTER);
            doc.add(sub1);
            doc.add(Chunk.NEWLINE);
            doc.add(new Chunk(new LineSeparator(1, 100, CYAN, Element.ALIGN_CENTER, -2)));
            doc.add(Chunk.NEWLINE);
            Paragraph receiptId = new Paragraph("Receipt #SGT-" + String.format("%05d", sub.getId()), headerFont);
            receiptId.setAlignment(Element.ALIGN_CENTER);
            doc.add(receiptId);
            doc.add(Chunk.NEWLINE);
            PdfPTable table = new PdfPTable(2);
            table.setWidthPercentage(100);
            table.setWidths(new float[]{35, 65});
            addRow(table, "Intern Name", sub.getIntern().getFullName(), bodyFont, valueFont);
            addRow(table, "Email", sub.getIntern().getEmail(), bodyFont, valueFont);
            addRow(table, "Domain", sub.getIntern().getDomain(), bodyFont, valueFont);
            addRow(table, "Task Title", sub.getTaskTitle(), bodyFont, valueFont);
            addRow(table, "Project Type", sub.getProjectType(), bodyFont, valueFont);
            addRow(table, "File", sub.getFileName() != null ? sub.getFileName() : "N/A", bodyFont, valueFont);
            addRow(table, "Submitted", sub.getSubmittedAt() != null ? sub.getSubmittedAt().format(FMT) : "-", bodyFont, valueFont);
            addRow(table, "Status", sub.getStatus().name(), bodyFont, valueFont);
            if (sub.getFeedback() != null && !sub.getFeedback().isBlank()) {
                addRow(table, "Feedback", sub.getFeedback(), bodyFont, valueFont);
            }
            doc.add(table);
            doc.add(Chunk.NEWLINE);
            Paragraph footer = new Paragraph("SoftGrowTech Portal - Learn Build Evolve", bodyFont);
            footer.setAlignment(Element.ALIGN_CENTER);
            doc.add(footer);
            doc.close();
            return baos.toByteArray();
        } catch (Exception e) {
            System.err.println("PDF generation failed: " + e.getMessage());
            return new byte[0];
        }
    }

    private void addRow(PdfPTable table, String label, String value, Font lf, Font vf) {
        PdfPCell lc = new PdfPCell(new Phrase(label, lf));
        lc.setBorderColor(new BaseColor(30, 50, 80));
        lc.setPadding(8);
        lc.setBackgroundColor(new BaseColor(10, 25, 47));
        PdfPCell vc = new PdfPCell(new Phrase(value != null ? value : "-", vf));
        vc.setBorderColor(new BaseColor(30, 50, 80));
        vc.setPadding(8);
        vc.setBackgroundColor(DARK);
        table.addCell(lc);
        table.addCell(vc);
    }
}