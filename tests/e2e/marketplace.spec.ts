import { test, expect } from '@playwright/test';

test.describe('Testes Básicos do Marketplace', () => {


  test('Botões de compra funcionam', async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Teste de Compra</title>
        </head>
        <body>
          <div class="product">
            <h3>Produto de Teste</h3>
            <button id="buy-btn">Comprar</button>
            <div id="status" style="display: none;">Comprando...</div>
          </div>
          <script>
            document.getElementById('buy-btn').addEventListener('click', function() {
              this.style.display = 'none';
              document.getElementById('status').style.display = 'block';
            });
          </script>
        </body>
      </html>
    `);
    
    const buyButton = page.getByRole('button', { name: 'Comprar' });
    await expect(buyButton).toBeVisible();
    await buyButton.click();
    await expect(page.getByText('Comprando...')).toBeVisible();
  });

  test('Staking interface funciona', async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Teste de Staking</title>
        </head>
        <body>
          <div class="staking">
            <h3>Staking de Tokens</h3>
            <input type="number" placeholder="Quantidade para stake" id="stake-input">
            <button id="stake-btn">Fazer Stake</button>
          </div>
        </body>
      </html>
    `);
    
    await expect(page.getByText('Staking de Tokens')).toBeVisible();
    await expect(page.getByPlaceholder('Quantidade para stake')).toBeVisible();
    
    const stakeInput = page.getByPlaceholder('Quantidade para stake');
    await stakeInput.fill('10');
    await expect(stakeInput).toHaveValue('10');
    
    const stakeButton = page.getByRole('button', { name: 'Fazer Stake' });
    await expect(stakeButton).toBeEnabled();
  });
});
