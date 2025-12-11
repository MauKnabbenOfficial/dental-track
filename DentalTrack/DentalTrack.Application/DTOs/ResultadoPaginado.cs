namespace DentalTrack.Application.DTOs
{
    /// <summary>
    /// Resultado paginado genérico
    /// </summary>
    public class ResultadoPaginado<T>
    {
        public List<T> Dados { get; set; } = new();
        public int Total { get; set; }
        public int Pagina { get; set; }
        public int TamanhoPagina { get; set; }
        public int TotalPaginas { get; set; }

        public ResultadoPaginado() { }

        public ResultadoPaginado(List<T> dados, int total, int pagina, int tamanhoPagina)
        {
            Dados = dados;
            Total = total;
            Pagina = pagina;
            TamanhoPagina = tamanhoPagina;
            TotalPaginas = (int)Math.Ceiling(total / (double)tamanhoPagina);
        }
    }
}
