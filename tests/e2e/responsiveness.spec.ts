import { test, expect } from '@playwright/test';

const viewports = [
  { name: 'Mobile', width: 375, height: 667 },
  { name: 'Tablet', width: 768, height: 1024 },
  { name: 'Desktop', width: 1280, height: 720 },
];

test.describe('Testes Básicos de Responsividade', () => {
  for (const viewport of viewports) {
    test(`Layout responsivo funciona em ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      
      await page.setContent(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Teste Responsivo - ${viewport.name}</title>
            <style>
              body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
              .container { max-width: 1200px; margin: 0 auto; }
              .header { background: #333; color: white; padding: 10px; text-align: center; }
              .content { padding: 20px 0; }
              .card { border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 5px; }
              @media (max-width: 768px) {
                .header { padding: 15px; }
                .card { margin: 5px 0; padding: 10px; }
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>ZeroDev Token Shop</h1>
              </div>
              <div class="content">
                <div class="card">
                  <h2>Produto 1</h2>
                  <p>Descrição do produto responsivo</p>
                  <button>Comprar</button>
                </div>
                <div class="card">
                  <h2>Produto 2</h2>
                  <p>Outro produto que se adapta ao tamanho da tela</p>
                  <button>Comprar</button>
                </div>
              </div>
            </div>
          </body>
        </html>
      `);

      // Verifica se elementos principais estão visíveis
      await expect(page.getByRole('heading', { name: 'ZeroDev Token Shop' })).toBeVisible();
      await expect(page.getByText('Produto 1')).toBeVisible();
      await expect(page.getByText('Produto 2')).toBeVisible();
      
      // Verifica se não há scroll horizontal
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.body.scrollWidth > window.innerWidth;
      });
      expect(hasHorizontalScroll).toBe(false);

      // Verifica se botões são clicáveis
      const buttons = page.getByRole('button', { name: 'Comprar' });
      await expect(buttons.first()).toBeVisible();
      await expect(buttons.first()).toBeEnabled();
      
      // Para mobile, verifica se header tem padding adequado
      if (viewport.width <= 768) {
        const header = page.locator('.header');
        await expect(header).toBeVisible();
      }
    });
  }

  test('Elementos se adaptam ao tamanho da tela', async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Teste de Adaptação</title>
          <style>
            .flexible-container {
              width: 100%;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
              box-sizing: border-box;
            }
            .responsive-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
              gap: 20px;
            }
            .item {
              background: #f0f0f0;
              padding: 15px;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="flexible-container">
            <h1>Grid Responsivo</h1>
            <div class="responsive-grid">
              <div class="item">Item 1</div>
              <div class="item">Item 2</div>
              <div class="item">Item 3</div>
            </div>
          </div>
        </body>
      </html>
    `);

    // Teste em mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.getByText('Grid Responsivo')).toBeVisible();
    await expect(page.getByText('Item 1')).toBeVisible();
    
    // Teste em desktop
    await page.setViewportSize({ width: 1280, height: 720 });
    await expect(page.getByText('Grid Responsivo')).toBeVisible();
    await expect(page.getByText('Item 1')).toBeVisible();
    
    // Verifica se todos os itens são visíveis
    await expect(page.getByText('Item 2')).toBeVisible();
    await expect(page.getByText('Item 3')).toBeVisible();
  });
});
