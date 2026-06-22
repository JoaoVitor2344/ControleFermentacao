using ControleFermentacaoCervejeira.Application.Features.FermentationRecords.Commands;
using ControleFermentacaoCervejeira.Application.Features.FermentationRecords.Queries;
using ControleFermentacaoCervejeira.Domain.Enums;
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

    [HttpGet("records")]
    public async Task<IActionResult> GetAll(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] Guid? beerId = null,
        [FromQuery] Guid? tankId = null,
        [FromQuery] string? batchNumber = null,
        [FromQuery] FermentationStatus? status = null,
        [FromQuery] bool ascending = false)
    {
        var result = await _mediator.Send(new GetAllFermentationRecordsQuery
        {
            Page = page,
            PageSize = pageSize,
            BeerId = beerId,
            TankId = tankId,
            BatchNumber = batchNumber,
            Status = status,
            Ascending = ascending
        });
        return Ok(result);
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

    [HttpPut("records/{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateFermentationRecordCommand command)
    {
        if (id != command.Id)
            return BadRequest(new { Message = "ID da rota não bate com o corpo da requisição." });

        var success = await _mediator.Send(command);
        if (!success) return NotFound(new { Message = "Registro não encontrado." });

        return NoContent();
    }

    [HttpGet("summary")]
    public async Task<IActionResult> GetSummaryAsync()
    {
        var summary = await _mediator.Send(new GetFermentationSummaryQuery());
        return Ok(summary);
    }

    [HttpGet("batches")]
    public async Task<IActionResult> GetAllBatches()
    {
        var batches = await _mediator.Send(new GetAllFermentationBatchesQuery());
        return Ok(batches);
    }

    [HttpGet("batch/{batchNumber}")]
    public async Task<IActionResult> GetByBatch(string batchNumber)
    {
        var query = new GetFermentationRecordsByBatchQuery(batchNumber);
        var records = await _mediator.Send(query);
        return Ok(records);
    }
}
