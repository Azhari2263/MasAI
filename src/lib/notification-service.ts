// src/lib/notification-service.ts

interface EmailTemplate {
  subject: string
  html: string
  text: string
}

interface ApplicationData {
  application_number: string
  full_name: string
  email: string
  object_type?: string
  estimated_value?: number
  loan_amount?: number
  branch_name?: string
}

export class NotificationService {
  private apiKey: string
  private fromEmail: string

  constructor() {
    this.apiKey = process.env.EMAIL_API_KEY || ''
    this.fromEmail = process.env.EMAIL_FROM || 'noreply@masai.id'
  }

  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  private getApprovalTemplate(data: ApplicationData): EmailTemplate {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%); 
                    padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .header h1 { color: white; margin: 0; }
          .content { background: #fff; padding: 30px; border: 1px solid #e5e7eb; }
          .status { background: #d1fae5; color: #065f46; padding: 15px; 
                   border-radius: 8px; text-align: center; font-weight: bold; margin: 20px 0; }
          .info-table { width: 100%; margin: 20px 0; }
          .info-table td { padding: 10px; border-bottom: 1px solid #e5e7eb; }
          .info-table td:first-child { font-weight: bold; color: #6b7280; }
          .button { display: inline-block; background: #f59e0b; color: white; 
                   padding: 12px 30px; text-decoration: none; border-radius: 6px; 
                   margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✓ Pengajuan Disetujui</h1>
          </div>
          <div class="content">
            <p>Yth. Bapak/Ibu <strong>${data.full_name}</strong>,</p>
            
            <div class="status">
              PENGAJUAN GADAI ANDA TELAH DISETUJUI
            </div>

            <p>Selamat! Pengajuan gadai emas Anda telah disetujui oleh tim kami.</p>

            <table class="info-table">
              <tr>
                <td>Nomor Pengajuan</td>
                <td><strong>${data.application_number}</strong></td>
              </tr>
              <tr>
                <td>Jenis Emas</td>
                <td>${data.object_type || '-'}</td>
              </tr>
              <tr>
                <td>Estimasi Nilai</td>
                <td><strong>${this.formatCurrency(data.estimated_value || 0)}</strong></td>
              </tr>
              <tr>
                <td>Plafon Pinjaman</td>
                <td><strong style="color: #2563eb;">${this.formatCurrency(data.loan_amount || 0)}</strong></td>
              </tr>
              <tr>
                <td>Cabang</td>
                <td>${data.branch_name || '-'}</td>
              </tr>
            </table>

            <h3>Langkah Selanjutnya:</h3>
            <ol>
              <li>Siapkan dokumen identitas (KTP/SIM) asli</li>
              <li>Bawa emas yang akan digadai</li>
              <li>Datang ke cabang Pegadaian ${data.branch_name || 'terdekat'}</li>
              <li>Proses pencairan dapat dilakukan dalam 1x24 jam</li>
            </ol>

            <p style="text-align: center;">
              <a href="https://masai.pegadaian.co.id/tracking?id=${data.application_number}" class="button">
                Lacak Pengajuan
              </a>
            </p>

            <p style="color: #6b7280; font-size: 14px;">
              <strong>Catatan:</strong> Silakan datang ke cabang maksimal 7 hari setelah persetujuan. 
              Pengajuan akan hangus jika tidak ditindaklanjuti.
            </p>
          </div>
          <div class="footer">
            <p>Email ini dikirim secara otomatis oleh sistem MasAI</p>
            <p>© 2024 PT Pegadaian (Persero). All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `

    const text = `
      Pengajuan Gadai Disetujui
      
      Yth. ${data.full_name},
      
      Selamat! Pengajuan gadai emas Anda telah disetujui.
      
      Nomor Pengajuan: ${data.application_number}
      Jenis Emas: ${data.object_type || '-'}
      Plafon Pinjaman: ${this.formatCurrency(data.loan_amount || 0)}
      Cabang: ${data.branch_name || '-'}
      
      Silakan datang ke cabang untuk proses pencairan.
      
      Terima kasih,
      Tim MasAI - Pegadaian
    `

    return {
      subject: `✓ Pengajuan Gadai Disetujui - ${data.application_number}`,
      html,
      text
    }
  }

  private getRejectionTemplate(data: ApplicationData, reason: string): EmailTemplate {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); 
                    padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .header h1 { color: white; margin: 0; }
          .content { background: #fff; padding: 30px; border: 1px solid #e5e7eb; }
          .status { background: #fee2e2; color: #991b1b; padding: 15px; 
                   border-radius: 8px; text-align: center; font-weight: bold; margin: 20px 0; }
          .reason-box { background: #fef3c7; border-left: 4px solid #f59e0b; 
                       padding: 15px; margin: 20px 0; }
          .button { display: inline-block; background: #f59e0b; color: white; 
                   padding: 12px 30px; text-decoration: none; border-radius: 6px; 
                   margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✗ Pengajuan Ditolak</h1>
          </div>
          <div class="content">
            <p>Yth. Bapak/Ibu <strong>${data.full_name}</strong>,</p>
            
            <div class="status">
              PENGAJUAN GADAI TIDAK DAPAT DIPROSES
            </div>

            <p>Mohon maaf, setelah dilakukan evaluasi, pengajuan gadai emas Anda dengan nomor 
            <strong>${data.application_number}</strong> tidak dapat kami proses lebih lanjut.</p>

            <div class="reason-box">
              <strong>Alasan Penolakan:</strong><br>
              ${reason}
            </div>

            <h3>Apa yang bisa Anda lakukan?</h3>
            <ul>
              <li>Hubungi customer service kami untuk penjelasan lebih detail</li>
              <li>Perbaiki dokumen atau persyaratan yang kurang</li>
              <li>Ajukan kembali setelah memenuhi persyaratan</li>
            </ul>

            <p style="text-align: center;">
              <a href="https://masai.pegadaian.co.id/support" class="button">
                Hubungi Customer Service
              </a>
            </p>

            <p style="color: #6b7280; font-size: 14px;">
              Anda dapat mengajukan estimasi baru kapan saja melalui aplikasi MasAI.
            </p>
          </div>
          <div class="footer">
            <p>Email ini dikirim secara otomatis oleh sistem MasAI</p>
            <p>© 2024 PT Pegadaian (Persero). All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `

    const text = `
      Pengajuan Gadai Ditolak
      
      Yth. ${data.full_name},
      
      Mohon maaf, pengajuan gadai Anda tidak dapat diproses.
      
      Nomor Pengajuan: ${data.application_number}
      Alasan: ${reason}
      
      Untuk informasi lebih lanjut, hubungi customer service kami.
      
      Terima kasih,
      Tim MasAI - Pegadaian
    `

    return {
      subject: `Pengajuan Ditolak - ${data.application_number}`,
      html,
      text
    }
  }

  async sendEmail(to: string, template: EmailTemplate): Promise<boolean> {
    try {
      // Using a mock email service for demonstration
      // In production, integrate with services like SendGrid, AWS SES, etc.
      
      console.log('Sending email to:', to)
      console.log('Subject:', template.subject)
      
      // Example: SendGrid integration
      /*
      const sgMail = require('@sendgrid/mail')
      sgMail.setApiKey(this.apiKey)
      
      const msg = {
        to,
        from: this.fromEmail,
        subject: template.subject,
        text: template.text,
        html: template.html,
      }
      
      await sgMail.send(msg)
      */

      // For now, just log and return success
      return true

    } catch (error) {
      console.error('Failed to send email:', error)
      return false
    }
  }

  async sendApprovalNotification(
    email: string, 
    applicationData: ApplicationData
  ): Promise<boolean> {
    const template = this.getApprovalTemplate(applicationData)
    return await this.sendEmail(email, template)
  }

  async sendRejectionNotification(
    email: string, 
    applicationData: ApplicationData,
    reason: string
  ): Promise<boolean> {
    const template = this.getRejectionTemplate(applicationData, reason)
    return await this.sendEmail(email, template)
  }

  async sendStatusUpdateNotification(
    email: string,
    applicationNumber: string,
    status: string,
    message: string
  ): Promise<boolean> {
    const template: EmailTemplate = {
      subject: `Update Status Pengajuan - ${applicationNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Update Status Pengajuan</h2>
          <p><strong>Nomor Pengajuan:</strong> ${applicationNumber}</p>
          <p><strong>Status:</strong> ${status}</p>
          <p>${message}</p>
          <p>Terima kasih,<br>Tim MasAI</p>
        </div>
      `,
      text: `Update Status Pengajuan\n\nNomor: ${applicationNumber}\nStatus: ${status}\n\n${message}`
    }

    return await this.sendEmail(email, template)
  }
}

// Export singleton instance
export const notificationService = new NotificationService()