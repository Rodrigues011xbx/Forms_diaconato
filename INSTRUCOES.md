# Guia de Configuração: Retiro de Diáconos 2026

Este sistema funciona sem um backend próprio, utilizando **FormSubmit** para recebimento de e-mails e **Google Sheets** como banco de dados para o painel administrativo.

## 1. Configuração do Google Sheets (Painel Admin)

Para que o `admin.html` mostre os dados reais da sua planilha, siga estes passos:

### Passo A: Criar a Planilha
1. Crie uma nova planilha no Google Sheets.
2. Na primeira linha, adicione os cabeçalhos exatamente assim:
   `nome`, `cidade`, `cobertura`, `funcao`, `dificuldade`, `data`

### Passo B: Publicar como CSV
1. Vá em **Arquivo > Compartilhar > Publicar na Web**.
2. No menu suspenso, mude de "Página da Web" para **Valores separados por vírgula (.csv)**.
3. Clique em **Publicar** e copie a URL gerada (ela termina em `output=csv`).
4. Abra o arquivo `admin.html` e substitua a constante `GOOGLE_SHEETS_CSV_URL` pela sua URL.

---

## 2. Envio Automático para Planilha (Opcional - Recomendo)

Se você quiser que os dados caiam na planilha automaticamente ao enviar o formulário, utilize um **Google Apps Script**:

1. Na sua planilha, vá em **Extensões > Apps Script**.
2. Cole o código abaixo:

```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  
  sheet.appendRow([
    data.nome, 
    data.cidade, 
    data.cobertura, 
    data.funcao, 
    data.dificuldade, 
    new Date()
  ]);
  
  return ContentService.createTextOutput(JSON.stringify({result: 'success'}))
    .setMimeType(ContentService.MimeType.JSON);
}
```

3. Clique em **Implantar > Nova Implantação**.
4. Selecione **App da web**.
5. Em "Quem pode acessar", selecione **Qualquer pessoa**.
6. Copie a URL gerada e adicione no `script.js` para fazer um segundo `fetch`.

---

## 3. Configuração do E-mail (FormSubmit)

No arquivo `index.html`, localize o `<form>` e mude o e-mail:
```html
<form action="https://formsubmit.co/SEU_EMAIL_AQUI" method="POST">
```
Após o primeiro envio, você receberá um e-mail do FormSubmit para **confirmar** o endereço. A partir daí, as inscrições chegarão direto na sua caixa de entrada.

---

## 🎨 Destaques do Design Implementado
- **Glassmorphism**: Efeito de vidro jateado nos cartões.
- **Micro-animações**: Feedback nos botões e inputs.
- **Floating Labels**: Labels que se movem ao focar no campo.
- **Responsividade**: Otimizado para smartphones e desktops.
- **Dashboard Moderno**: Visual limpo com estatísticas rápidas.
