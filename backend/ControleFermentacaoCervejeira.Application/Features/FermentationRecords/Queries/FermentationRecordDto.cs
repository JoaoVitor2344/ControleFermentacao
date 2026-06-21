namespace ControleFermentacaoCervejeira.Application.Features.FermentationRecords.Queries;

public class FermentationRecordDto
{
    public Guid Id { get; set; }
    public decimal Temperature { get; set; }
    public decimal Ph { get; set; }
    public decimal Extract { get; set; }
    public string Notes { get; set; } = string.Empty;
    public DateTime RecordedAt { get; set; }
    public string Status { get; set; } = string.Empty;
}