using ControleFermentacao.Domain.Enums;

namespace ControleFermentacao.Domain.Entities;

public class FermentationRecord
{
    public Guid Id { get; private set; }
    public Guid BeerId { get; private set; }
    public Guid TankId { get; private set; }
    public string BatchNumber { get; private set; }

    // Valores Medidos
    public decimal Temperature { get; private set; }
    public decimal Ph { get; private set; }
    public decimal Extract { get; private set; }
    public decimal Notes { get; private set; }

    // Controle
    public FermentationStatus Status { get; private set; }
    public DateTime RecordedAt { get; private set; }

    public FermentationRecord(Guid beerId, Guid tankId, string batchNumber, decimal temperature, decimal ph,
        decimal extract, decimal notes, DateTime recordedAt)
    {
        Id = Guid.NewGuid();
        BeerId = beerId;
        TankId = tankId;
        BatchNumber = batchNumber;
        Temperature = temperature;
        Ph = ph;
        Extract = extract;
        Notes = notes;
        RecordedAt = recordedAt;

        // O status é calculado automaticamente no momento da criação do registro
        // Status = CalculateStatus(beerLimits);
    }

    private FermentationStatus CalculateStatus(Beer beer)
    {
        // 1. Validação de "Fora do Padrão"
        if (Temperature < beer.MinTemperature || Temperature > beer.MaxTemperature || Ph < beer.MinPh ||
            Ph > beer.MaxPh || Extract < beer.MinExtract || Extract > beer.MaxExtract)
        {
            return FermentationStatus.OutOfPattern;
        }

        // 2. Validação de "Atenção"
        if (IsAttentionZone(Temperature, beer.MinTemperature, beer.MaxTemperature) ||
            IsAttentionZone(Ph, beer.MinPh, beer.MaxPh) ||
            IsAttentionZone(Extract, beer.MinExtract, beer.MaxExtract))
        {
            return FermentationStatus.Attention;
        }

        // 3. Dentro do Padrão
        return FermentationStatus.WithinPattern;
    }

    // Método para cálculo da margem dinâmica
    private bool IsAttentionZone(decimal value, decimal min, decimal max)
    {
        decimal ampliture = max - min;
        decimal margin = ampliture * 0.10m;

        bool isNearMin = value >= min && value <= (min + margin);
        bool isNearMax = value <= max && value >= (max - margin);

        return isNearMin || isNearMax;
    }
}