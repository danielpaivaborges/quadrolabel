# QuadroLabel

Aplicativo web independente para criar etiquetas de identificação de circuitos de quadros de distribuição elétrica.

## Recursos

- Editor de circuitos com nome, categoria, corrente nominal e quantidade de módulos.
- Pré-visualização de disjuntores e etiquetas com larguras proporcionais à largura configurada por módulo DIN.
- Temas colorido e monocromático.
- Categorias: geral, iluminação, tomadas, cozinha, chuveiro, DR/IDR, DPS, ar-condicionado, reserva e outros.
- Impressão em escala física (milímetros) usando o navegador.
- Salvamento automático local, exportação e importação de projeto JSON.
- Interface adaptável a desktop e celular, sem bibliotecas externas.

## Catálogo visual DIN

A biblioteca rápida contém **39 configurações visuais** agrupadas em proteção, comando, medição e automação, com filtros por largura modular, pesquisa textual, favoritos e itens recentes. Favoritos e histórico ficam apenas no armazenamento local deste navegador e não modificam o arquivo JSON de projetos. As ilustrações e combinações de larguras são referências genéricas de interface: **não são catálogo comercial ou especificação de polos, dimensões e conexões de qualquer fabricante**. Confirme sempre o equipamento real antes de usar o desenho em uma montagem.

## Executar

Abra `index.html` em seu navegador. Não é necessário instalar dependências nem criar conta.

## Publicar no GitHub Pages

1. Abra **Settings → Pages** no repositório.
2. Em **Build and deployment**, escolha **Deploy from a branch**.
3. Selecione **main** e **/(root)**; clique em **Save**.
4. Aguarde a publicação e acesse https://danielpaivaborges.github.io/quadrolabel/

## Impressão

1. Configure a largura de módulo DIN conforme o fabricante do dispositivo (18 mm é apenas referência).
2. Clique em **Imprimir etiquetas**.
3. Configure papel A4, **Escala 100% / Tamanho real**, sem cabeçalhos e rodapés.
4. Imprima inicialmente em papel comum, confira com uma régua e compare com os dispositivos antes de usar papel adesivo.

> Nota: os símbolos são pictogramas ilustrativos, não representam obrigatoriamente simbologia normativa. As etiquetas não substituem projeto elétrico, identificação exigida pelas normas aplicáveis, verificação por profissional habilitado nem ensaios de segurança.

## Privacidade

Dados de projeto ficam no navegador (localStorage) e nos arquivos JSON exportados pelo usuário. Não há backend ou transmissão de dados de projetos.

## Licença

Licença ainda não definida. A publicação do código não implica automaticamente uma licença de reutilização.
