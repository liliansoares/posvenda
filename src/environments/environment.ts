// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: true,
  complementUriGTA: '',
  uriLoginGTA: 'http://cap1177/brasilcap-gestao-acesso-web/services/autenticacao/autenticar',
  uriModulosGTA: 'http://cap1177/brasilcap-gestao-acesso-web/services/grupoModulo/consultarPorPlataforma?idPlataforma=59',
  uriFuncionalidadesGTA: 'http://cap1177/brasilcap-gestao-acesso-web/services/funcionalidade/consultar?',
  uriAcoesGTA: 'http://cap1177/brasilcap-gestao-acesso-web/services/funcionalidade/consultarPorChave?chave=',

  urlConsultarToken: "http://cap1177/brasilcap-gestao-acesso-web/services/usuario/consultarToken",
  urlListarChargeBacks: 'http://cap-financeiro.kratos-dev/cap-financeiro/chargeback/listarChargebacks',
  urlListarPlanos: 'http://cap-financeiro.kratos-dev/cap-financeiro/chargeback/listarPlanos',
  urlGetStatus: 'http://cap-financeiro.kratos-dev/cap-financeiro/chargeback/listarStatusChargeback',
  urlPostUpload: 'http://cap-financeiro.kratos-dev/cap-financeiro/chargeback/tratarChargeback',
  urlGetParceiros: 'http://cap-financeiro.kratos-dev/cap-financeiro/chargeback/listarParceiros',
  urlDownloadArqChargeback: 'http://cap-financeiro.kratos-dev/cap-financeiro/chargeback/baixarArquivo?nomeArquivo=',
  urlExportaPDFChargeback: 'http://cap-financeiro.kratos-dev/cap-financeiro/chargeback/exportarPesquisa?tipo=pdf',
  urlExportaXLSChargeback: 'http://cap-financeiro.kratos-dev/cap-financeiro/chargeback/exportarPesquisa?tipo=xls',

  urlListarCobrancas: 'http://cap-financeiro.kratos-dev/cap-financeiro/cobranca/listarCobranca?',
  urlListarCobrancasDetalhada: 'http://cap-financeiro.kratos-dev/cap-financeiro/cobranca/listarDetalheCobranca?',
  urlTratarCobranca: 'http://cap-financeiro.kratos-dev/cap-financeiro/cobranca/eventoTratamento?',
  urlHistoricoCobrancas: 'http://cap-financeiro.kratos-dev/cap-financeiro/cobranca/listarHistoricoTratamentoCobranca?'
// tslint:disable-next-line:eofline
};