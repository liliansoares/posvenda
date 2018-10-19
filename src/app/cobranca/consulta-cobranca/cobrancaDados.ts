export class cobrancaDados {
    data: string;
    usuario: string;
    status: string;
    descricao: string;

    constructor(paramData: string, paramUsuario: string, paramStatus: string, paramDescricao: string) {
        this.data = paramData;
        this.usuario = paramUsuario;
        this.status = paramStatus;
        this.descricao = paramDescricao;
    }
}
