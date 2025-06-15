import { test, expect } from '@playwright/test';

test.describe('Testes Básicos de Acessibilidade', () => {
  test('Botões são focáveis via teclado', async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Teste de Acessibilidade</title>
        </head>
        <body>
          <button>Primeiro Botão</button>
          <button>Segundo Botão</button>
          <input type="text" placeholder="Campo de entrada">
        </body>
      </html>
    `);
    
    // Testa se botões são focáveis
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'Primeiro Botão' })).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'Segundo Botão' })).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.getByPlaceholder('Campo de entrada')).toBeFocused();
  });

  test('Links têm texto adequado', async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Teste de Links</title>
        </head>
        <body>
          <a href="/home">Página Inicial</a>
          <a href="/marketplace" aria-label="Ir para o marketplace">🛒</a>
          <a href="/about">Sobre Nós</a>
        </body>
      </html>
    `);
    
    // Verifica se links têm texto ou aria-label
    const homeLink = page.getByRole('link', { name: 'Página Inicial' });
    await expect(homeLink).toBeVisible();
    
    const marketplaceLink = page.getByRole('link', { name: 'Ir para o marketplace' });
    await expect(marketplaceLink).toBeVisible();
    
    const aboutLink = page.getByRole('link', { name: 'Sobre Nós' });
    await expect(aboutLink).toBeVisible();
  });

  test('Headings seguem hierarquia', async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Teste de Headings</title>
        </head>
        <body>
          <h1>Título Principal</h1>
          <h2>Subtítulo</h2>
          <h3>Sub-subtítulo</h3>
          <p>Conteúdo regular</p>
        </body>
      </html>
    `);
    
    // Verifica se headings estão presentes
    await expect(page.getByRole('heading', { level: 1, name: 'Título Principal' })).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: 'Subtítulo' })).toBeVisible();
    await expect(page.getByRole('heading', { level: 3, name: 'Sub-subtítulo' })).toBeVisible();
  });

  test('Formulários têm labels apropriados', async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Teste de Formulários</title>
        </head>
        <body>
          <form>
            <label for="name">Nome:</label>
            <input type="text" id="name" name="name">
            
            <label for="email">Email:</label>
            <input type="email" id="email" name="email">
            
            <button type="submit">Enviar</button>
          </form>
        </body>
      </html>
    `);
    
    // Verifica se inputs têm labels
    await expect(page.getByRole('textbox', { name: 'Nome:' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Email:' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Enviar' })).toBeVisible();
  });
});
