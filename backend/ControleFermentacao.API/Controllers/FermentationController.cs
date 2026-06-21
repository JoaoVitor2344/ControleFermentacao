using ControleFermentacao.Application.Features.FermentationRecords.Commands;
using ControleFermentacao.Application.Features.FermentationRecords.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace ControleFermentacao.Controllers;

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
        try
        {
            // O MediatR pega o comando e roteia para o RegisterFermentationCommandHandler
            var recordId = await _mediator.Send(command);

            return Ok(new
            {
                Message = "Apontamento de fermentação registrado com sucesso",
                RecordId = recordId
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new { Error = ex.Message });
        }
    }

    [HttpGet("summary")]
    public async Task<IActionResult> GetSummaryAsync()
    {
        try
        {
            var summary = await _mediator.Send(new GetFermentationSummaryQuery());
            return Ok(summary);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
            throw;
        }
    }

    [HttpGet("batch/{batchNumber}")]
    public async Task<IActionResult> GetByBatch(string batchNumber)
    {
        try
        {
            var query = new GetFermentationRecordsByBatchQuery(batchNumber);
            var records = await _mediator.Send(query);
            return Ok(records);
        }
        catch (Exception ex)
        {
            return BadRequest(new { Error = ex.Message });
        }
    }
}