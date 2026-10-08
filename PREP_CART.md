# Carrinho da Loja TFR — candidato de produção

Branch: `cart-production-ready`

Esta branch é o candidato de produção do carrinho multi-item. Ela foi criada a partir do ambiente de teste que passou pelos testes visuais e funcionais sem gerar pagamento real.

## Validado no ambiente isolado

- carrinho flutuante visível no catálogo e nas páginas de produto;
- adicionar, remover, aumentar e diminuir quantidade;
- dois produtos diferentes no mesmo carrinho;
- resumo do checkout com os dois itens;
- subtotal conjunto;
- frete calculado para o carrinho completo;
- retirada na loja;
- Correios PAC e SEDEX;
- total = produtos + frete;
- etapa do Mercado Pago carregando Pix e cartão;
- backend preparado para `store_order_items`, estoque por item, e-mail multi-item e sincronização de uma única ordem para o TFR Produção;
- popup de confirmação de pagamento preservado.

## Proteções desta branch

- o nome no `wrangler.jsonc` é `tfr-site-cart-release-candidate`, não `tfr-site`;
- `keep_vars: true` preserva variáveis configuradas no painel;
- os quatro assets binários atuais são copiados da loja ao vivo antes do deploy pelo script `npm run prepare:assets`;
- os diagnósticos e bloqueios exclusivos do Worker de teste foram removidos;
- o carrinho e o popup de confirmação também estão embutidos no shell estático como fallback, e os injetores do Worker são idempotentes para evitar duplicação.

## Ainda NÃO implantar na produção

Antes de trocar o nome para `tfr-site` ou conectar esta branch ao Worker de produção, é necessário colocar no `wrangler.jsonc` as associações reais do Worker atual, principalmente:

- D1 `DB` → `tfr-biblioteca` com seu `database_id`;
- D1 `PROD_DB` → `tfr-producao-db` com seu `database_id`;
- R2 `PRODUCT_FILES` → `tfr-biblioteca-produtos`.

Secrets não devem ser gravados no GitHub.

Quando esses bindings forem conferidos, revisar o deploy command para executar `npm run deploy`, fazer uma implantação controlada e validar uma compra real de baixo valor.


## Implantação autorizada

Implantação do carrinho multi-item autorizada para o Worker de produção `tfr-site` em 2026-10-08.

Este commit existe para disparar a primeira compilação/implantação da branch `cart-production-final`.
