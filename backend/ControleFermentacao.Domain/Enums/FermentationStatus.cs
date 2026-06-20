namespace ControleFermentacao.Domain.Enums;

public enum FermentationStatus
{
    WithinPattern = 1, // dentro do padrão
    Attention = 2, // requer atenção
    OutOfPattern = 3 // fora do padrão
}