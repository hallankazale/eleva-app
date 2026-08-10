# Eleva

PWA mobile-first de afirmações, foco e pequenas ações diárias.

## Objetivo

Criar primeiro uma experiência completa no GitHub Pages e, após validação, empacotar a mesma base como APK Android.

## Recursos atuais

- Splash animada
- Onboarding em 3 etapas
- Escolha de objetivos
- Configuração manhã/noite
- Home responsiva
- Leitura de frases com SpeechSynthesis
- Favoritos
- Jornada de 21 dias
- Persistência local
- Service Worker para uso offline

## Arquitetura atual

A primeira versão usa HTML, CSS e JavaScript leve para permitir publicação imediata no GitHub Pages sem etapa de build. A evolução para Capacitor/Android será feita após validação da experiência web.

## Testes manuais iniciais

1. Abrir no celular e concluir onboarding.
2. Fechar e reabrir para confirmar persistência.
3. Testar áudio em pt-BR.
4. Favoritar frase e verificar aba Favoritos.
5. Marcar ação diária e verificar progresso.
6. Ativar modo avião após primeira visita e confirmar abertura offline.
