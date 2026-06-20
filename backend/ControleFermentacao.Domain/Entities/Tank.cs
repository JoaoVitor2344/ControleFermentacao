namespace ControleFermentacao.Domain.Entities;

public class Tank
{
    public Guid Id { get; private set; }
    public string Name { get; private set; }
    public decimal CapacityLiters { get; private set; }

    public Tank(string name, decimal capacityLiters)
    {
        Id = Guid.NewGuid();
        Name = name;
        CapacityLiters = capacityLiters;
    }
}