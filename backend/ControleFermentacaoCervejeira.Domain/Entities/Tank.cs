using ControleFermentacaoCervejeira.Domain.Exceptions;

namespace ControleFermentacaoCervejeira.Domain.Entities;

public class Tank
{
    public Guid Id { get; private set; }
    public string Name { get; private set; }
    public decimal CapacityLiters { get; private set; }

    // SoftDelete
    public DateTime? DeletedAt { get; private set; }

    public Tank(string name, decimal capacityLiters)
    {
        Validate(name, capacityLiters);

        Id = Guid.NewGuid();
        Name = name;
        CapacityLiters = capacityLiters;
    }

    public void Update(string name, decimal capacityLiters)
    {
        Validate(name, capacityLiters);

        Name = name;
        CapacityLiters = capacityLiters;
    }

    public void Delete()
    {
        DeletedAt = DateTime.UtcNow;
    }

    private static void Validate(string name, decimal capacityLiters)
    {
        var errors = new List<string>();

        if (string.IsNullOrWhiteSpace(name))
            errors.Add("Nome do tanque é obrigatório.");

        if (capacityLiters <= 0)
            errors.Add("Capacidade do tanque deve ser maior que zero.");

        if (errors.Count > 0)
            throw new BusinessValidationException(errors);
    }
}