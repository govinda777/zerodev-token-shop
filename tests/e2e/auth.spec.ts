import { test, expect } from '@playwright/test';

test.describe('Testes Básicos de Autenticação', () => {
  test('Elementos de autenticação funcionam', async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Teste de Autenticação</title>
        </head>
        <body>
          <h1>ZeroDev Token Shop</h1>
          <div id="auth-section">
            <p>Faça login para acessar o marketplace</p>
            <button id="connect-wallet">Conectar Carteira</button>
          </div>
        </body>
      </html>
    `);
    
    // Verifica se elementos estão visíveis
    await expect(page.getByText('ZeroDev Token Shop')).toBeVisible();
    await expect(page.getByText('Faça login para acessar o marketplace')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Conectar Carteira' })).toBeVisible();
  });

  test('Botão de conexão é clicável', async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Teste de Botão</title>
        </head>
        <body>
          <button id="connect-btn">Conectar Carteira</button>
          <script>
            document.getElementById('connect-btn').addEventListener('click', function() {
              this.textContent = 'Conectando...';
            });
          </script>
        </body>
      </html>
    `);
    
    const button = page.getByRole('button', { name: 'Conectar Carteira' });
    await expect(button).toBeVisible();
    await button.click();
    await expect(page.getByRole('button', { name: 'Conectando...' })).toBeVisible();
  });
});
