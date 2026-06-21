namespace ControleFermentacaoCervejeira.Domain.Entities;

public class Beer
{
    public Guid Id { get; set; }
    public string Name { get; private set; }
    public string Style { get; private set; }

    // Parâmetros aceitáveis
    public decimal MinTemperature { get; private set; }
    public decimal MaxTemperature { get; private set; }
    public decimal MinPh { get; private set; }
    public decimal MaxPh { get; private set; }
    public decimal MinExtract { get; private set; }
    public decimal MaxExtract { get; private set; }

    // SoftDelete
    public DateTime? DeletedAt { get; private set; }

    // Construtor para o Entity Framework
    public Beer(string name, string style, decimal minTemperature, decimal maxTemperature, decimal minPh, decimal maxPh,
        decimal minExtract, decimal maxExtract)
    {
        Id = Guid.NewGuid();
        Name = name;
        Style = style;
        MinTemperature = minTemperature;
        MaxTemperature = maxTemperature;
        MinPh = minPh;
        MaxPh = maxPh;
        MinExtract = minExtract;
        MaxExtract = maxExtract;
    }

    public void Update(string name, string style, decimal minTemperature, decimal maxTemperature,
        decimal minPh, decimal maxPh, decimal minExtract, decimal maxExtract)
    {
        Name = name;
        Style = style;
        MinTemperature = minTemperature;
        MaxTemperature = maxTemperature;
        MinPh = minPh;
        MaxPh = maxPh;
        MinExtract = minExtract;
        MaxExtract = maxExtract;
    }

    public void Delete()
    {
        DeletedAt = DateTime.UtcNow;
    }
}