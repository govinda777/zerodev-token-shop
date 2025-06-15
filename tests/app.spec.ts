import { test, expect } from '@playwright/test';

test.describe('Testes Básicos de Funcionalidade', () => {
  test('Playwright está funcionando corretamente', async ({ page }) => {
    // Criar uma página HTML simples para testar
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Teste ZeroDev Token Shop</title>
        </head>
        <body>
          <h1>ZeroDev Token Shop</h1>
          <p>Página de teste</p>
          <button id="test-button">Botão de Teste</button>
          <input type="text" placeholder="Digite aqui" id="test-input" />
        </body>
      </html>
    `);
    
    // Verifica se a página tem o título correto
    await expect(page).toHaveTitle('Teste ZeroDev Token Shop');
    
    // Verifica se elementos estão visíveis
    await expect(page.getByRole('heading', { name: 'ZeroDev Token Shop' })).toBeVisible();
    await expect(page.getByText('Página de teste')).toBeVisible();
    
    // Testa interação com botão
    const button = page.getByRole('button', { name: 'Botão de Teste' });
    await expect(button).toBeVisible();
    await button.click();
    
    // Testa input
    const input = page.getByPlaceholder('Digite aqui');
    await expect(input).toBeVisible();
    await input.fill('Teste de entrada');
    await expect(input).toHaveValue('Teste de entrada');
  });

  test('Navegação por teclado funciona', async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Teste de Navegação</title>
        </head>
        <body>
          <button>Primeiro Botão</button>
          <input type="text" placeholder="Campo de texto">
          <button>Segundo Botão</button>
        </body>
      </html>
    `);
    
    // Testa navegação por Tab
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'Primeiro Botão' })).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.getByPlaceholder('Campo de texto')).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'Segundo Botão' })).toBeFocused();
  });
  
  test('Responsividade básica funciona', async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Teste Responsivo</title>
          <style>
            body { margin: 0; padding: 20px; }
            .container { width: 100%; max-width: 1200px; margin: 0 auto; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Conteúdo Responsivo</h1>
          </div>
        </body>
      </html>
    `);
    
    // Testa em mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.getByRole('heading', { name: 'Conteúdo Responsivo' })).toBeVisible();
    
    // Verifica se não há scroll horizontal
    const mobileHasHorizontalScroll = await page.evaluate(() => {
      return document.body.scrollWidth > window.innerWidth;
    });
    expect(mobileHasHorizontalScroll).toBe(false);
    
    // Testa em desktop
    await page.setViewportSize({ width: 1280, height: 720 });
    await expect(page.getByRole('heading', { name: 'Conteúdo Responsivo' })).toBeVisible();
    
    const desktopHasHorizontalScroll = await page.evaluate(() => {
      return document.body.scrollWidth > window.innerWidth;
    });
    expect(desktopHasHorizontalScroll).toBe(false);
  });
}); 