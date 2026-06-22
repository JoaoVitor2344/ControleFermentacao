using ControleFermentacaoCervejeira.Domain.Exceptions;

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
        Validate(name, style, minTemperature, maxTemperature, minPh, maxPh, minExtract, maxExtract);

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
        Validate(name, style, minTemperature, maxTemperature, minPh, maxPh, minExtract, maxExtract);

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

    private static void Validate(string name, string style, decimal minTemperature, decimal maxTemperature,
        decimal minPh, decimal maxPh, decimal minExtract, decimal maxExtract)
    {
        var errors = new List<string>();

        if (string.IsNullOrWhiteSpace(name))
            errors.Add("Nome da cerveja é obrigatório.");

        if (string.IsNullOrWhiteSpace(style))
            errors.Add("Estilo da cerveja é obrigatório.");

        if (minTemperature >= maxTemperature)
            errors.Add("Temperatura mínima deve ser menor que a máxima.");

        if (minPh < 0)
            errors.Add("pH mínimo não pode ser negativo.");

        if (minPh >= maxPh)
            errors.Add("pH mínimo deve ser menor que o máximo.");

        if (minExtract < 0)
            errors.Add("Extrato mínimo não pode ser negativo.");

        if (minExtract >= maxExtract)
            errors.Add("Extrato mínimo deve ser menor que o máximo.");

        if (errors.Count > 0)
            throw new BusinessValidationException(errors);
    }
}