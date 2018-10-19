export class Dados {
    idStatusChargeback: string;
    descricaoMotivoRecusa: string;
    numAutorizacao: string;
    nsu: string;
    usuario: string;
    arquivo: File;
    seqPedido: string;

    constructor(paramUsuario: string ,paramNsu: string ,paramAutorizacao: string ,paramStatus: string, 
        paramDescricao: string, paramUpload: File, seqPedido: string) {
        this.idStatusChargeback = paramStatus;
        this.descricaoMotivoRecusa = paramDescricao;
        this.arquivo = paramUpload;
        this.numAutorizacao = paramAutorizacao;
        this.nsu = paramNsu;
        this.usuario = paramUsuario;
        this.seqPedido = seqPedido;
    }
}