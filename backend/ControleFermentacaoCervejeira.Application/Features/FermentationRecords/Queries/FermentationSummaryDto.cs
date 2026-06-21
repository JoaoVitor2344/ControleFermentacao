namespace ControleFermentacaoCervejeira.Application.Features.FermentationRecords.Queries;

public class FermentationSummaryDto
{
    public int TotalRecords { get; set; }
    public int WithinPattern { get; set; }
    public int Attention { get; set; }
    public int OutOfPattern { get; set; }
}