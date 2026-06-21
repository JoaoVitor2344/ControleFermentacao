using ControleFermentacaoCervejeira.Application.Features.FermentationRecords.Commands;
using ControleFermentacaoCervejeira.Application.Features.FermentationRecords.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace ControleFermentacaoCervejeira.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FermentationController : ControllerBase
{
    private readonly IMediator _mediator;

    public FermentationController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("records")]
    public async Task<IActionResult> RegisterRecord([FromBody] RegisterFermentationCommand command)
    {
        // O MediatR pega o comando e roteia para o RegisterFermentationCommandHandler
        var recordId = await _mediator.Send(command);

        return Ok(new
        {
            Message = "Apontamento de fermentação registrado com sucesso",
            RecordId = recordId
        });
    }

    [HttpGet("summary")]
    public async Task<IActionResult> GetSummaryAsync()
    {
        var summary = await _mediator.Send(new GetFermentationSummaryQuery());
        return Ok(summary);
    }

    [HttpGet("batch/{batchNumber}")]
    public async Task<IActionResult> GetByBatch(string batchNumber)
    {
        var query = new GetFermentationRecordsByBatchQuery(batchNumber);
        var records = await _mediator.Send(query);
        return Ok(records);
    }
}
