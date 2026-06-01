namespace BookStore.Application.Common;

public class PagedResult<T>
{
    public PagedResult(IEnumerable<T> items, int totalCount, int pageSize, int pageNumber)
    {
        Items = items;
        TotalItemsCount = totalCount;
        TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize);
        ItemsFrom = pageSize * (pageNumber - 1) + 1;
        ItemsTo = Math.Min(ItemsFrom + pageSize - 1, totalCount);
    }
    public IEnumerable<T> Items { get; set; }
    public int TotalPages { get; set; }
    public int TotalItemsCount { get; set; }
    public int ItemsFrom { get; set; }
    public int ItemsTo { get; set; }
}
public class PagedResult<T, TMeta> : PagedResult<T>
{
    public PagedResult(IEnumerable<T>items,int totalCount,int pageSize,int pageNumber,TMeta meta)
    :base(items,totalCount,pageSize,pageNumber)
    {
        Meta = meta;
    }
    public TMeta Meta { get; set; }
}
