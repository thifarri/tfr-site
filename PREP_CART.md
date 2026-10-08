# TFR Site — preparação segura do carrinho

Esta branch prepara a migração do Worker atual e a correção da ordem de roteamento dos Static Assets sem alterar a branch `main` nem o site em produção.

## Estado desta branch

- Contém uma cópia do Worker atualmente implantado, sem a rota temporária de recuperação de assets.
- Adiciona `wrangler.jsonc` com `assets.run_worker_first` para `/`, `/loja` e `/loja/*`.
- Usa o nome de Worker de preparação `tfr-site-cart-prep` para evitar substituir acidentalmente o Worker de produção.
- Ainda **não deve ser implantada**: a pasta `public` com os Static Assets atuais precisa ser restaurada integralmente.
- Bindings e secrets de produção não foram colocados no GitHub.

## Próxima etapa

Recuperar e versionar os Static Assets atuais. Depois disso, revisar bindings/configuração e testar a branch antes de qualquer mudança na produção.
