# 🔗 Conectando o Formulário à Planilha (Google Apps Script)

Como o **FormSubmit** foi projetado para enviar apenas **e-mails**, precisamos de um pequeno ajudante (este script abaixo) para que os dados do formulário também sejam gravados na sua **Planilha do Google**.

### Passo 1: Copie o Código abaixo
Na sua planilha, vá em **Extensões > Apps Script** e cole:

```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  
  // Confirme se os campos condizem com as colunas da sua planilha
  sheet.appendRow([
    data.nome, 
    data.cidade, 
    data.cobertura, 
    data.funcao, 
    data.dificuldade, 
    new Date()
  ]);
  
  // Retorna sucesso para o formulário
  return ContentService.createTextOutput(JSON.stringify({result: 'success'}))
    .setMimeType(ContentService.MimeType.JSON);
}

// IMPORTANTE: Clique em "Implantar" > "Nova Implantação"
// Tipo: "App da Web"
// Quem pode acessar: "Qualquer pessoa"
```

### Passo 2: Atualizar o seu `script.js`
Copie a **URL do App da Web** gerada no passo anterior e cole no lugar indicado abaixo:

```javascript
// Edite esta linha no seu script.js:
const GOOGLE_SCRIPT_URL = "SUA_URL_DO_APP_DA_WEB_AQUI";
```

O código abaixo envia os dados para **AMBOS**: FormSubmit (e-mail) e Google Sheets (planilha).
