using ControleFermentacaoCervejeira.Domain.Exceptions;
using ControleFermentacaoCervejeira.Domain.Interfaces;
using MediatR;

namespace ControleFermentacaoCervejeira.Application.Features.FermentationRecords.Commands;

public class UpdateFermentationRecordCommandHandler : IRequestHandler<UpdateFermentationRecordCommand, bool>
{
    private readonly IFermentationRecordRepository _recordRepository;
    private readonly IBeerRepository _beerRepository;

    public UpdateFermentationRecordCommandHandler(
        IFermentationRecordRepository recordRepository,
        IBeerRepository beerRepository)
    {
        _recordRepository = recordRepository;
        _beerRepository = beerRepository;
    }

    public async Task<bool> Handle(UpdateFermentationRecordCommand request, CancellationToken cancellationToken)
    {
        var record = await _recordRepository.GetByIdAsync(request.Id)
            ?? throw new NotFoundException("Registro de fermentação", request.Id);

        var beer = await _beerRepository.GetByIdAsync(record.BeerId)
            ?? throw new NotFoundException("Cerveja", record.BeerId);

        record.Update(request.Temperature, request.Ph, request.Extract, request.Notes, beer);
        await _recordRepository.UpdateAsync(record);

        return true;
    }
}
