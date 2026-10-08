# TFR Site — preparação segura do carrinho

Esta branch prepara a migração do Worker atual e a correção da ordem de roteamento dos Static Assets sem alterar a branch `main` nem o site em produção.

## Estado desta branch

- Contém uma cópia do Worker atualmente implantado, sem a rota temporária de recuperação de assets.
- O Worker versionado contém o código do carrinho e o popup de confirmação de pagamento.
- Preserva os três arquivos estáticos principais recuperados da implantação atual:
  - `public/index.html`
  - `public/assets/index-IkyPbxDH.js`
  - `public/assets/index-Cpd0D9Dw.css`
- Adiciona `wrangler.jsonc` com `assets.run_worker_first` para `/`, `/loja` e `/loja/*`.
- Usa o nome de Worker de preparação `tfr-site-cart-prep` para evitar substituir acidentalmente o Worker de produção.
- Bindings e secrets de produção não foram colocados no GitHub.
- Ainda **não deve ser implantada em produção**.

## Assets ainda não copiados

Os bundles atuais referenciam estes arquivos binários, que ainda precisam ser preservados antes do deploy final:

- `/tfr-logo.png`
- `/kim-flow-logo.png`
- `/favicon.png`
- `/111.png`

## Próxima etapa

Recuperar os quatro assets binários, configurar os bindings de teste e validar a branch em um Worker separado. Só depois disso revisar o nome/configuração de produção.
