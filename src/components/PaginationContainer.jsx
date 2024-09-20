import { useLoaderData, useNavigate, useLocation } from "react-router-dom";

const PaginationContainer = () => {
  const { meta } = useLoaderData();
  const { pageCount, page } = meta.pagination;
  const { search, pathname } = useLocation();

  const navigate = useNavigate();

  const handlePagination = (pageNum) => {
    const newSearchParams = new URLSearchParams(search);
    newSearchParams.set("page", pageNum);

    navigate(`${pathname}?${newSearchParams.toString()}`);
  };

  if (pageCount < 2) return null;

  return (
    <div className="mt-16 flex justify-end">
      <div className="join">
        <button
          className="btn btn-xs sm:btn-md join-item"
          onClick={() => {
            let prevPage = page - 1;
            if (prevPage < 1) prevPage = pageCount;
            // const newPage = ((page - 2 + pageCount) % pageCount) + 1;
            return handlePagination(prevPage);
          }}
        >
          Prev
        </button>
        {Array.from({ length: pageCount }, (_, index) => {
          const pageNum = index + 1;

          return (
            <button
              className={
                pageNum === page
                  ? "btn btn-xs sm:btn-md border-none join-item bg-base-300 border-base-300"
                  : "btn btn-xs sm:btn-md border-none join-item"
              }
              key={pageNum}
              onClick={() => handlePagination(pageNum)}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          className="btn btn-xs sm:btn-md join-item"
          onClick={() => {
            // const newPage = (page % pageCount) + 1;
            let nextPage = page + 1;
            if (nextPage > pageCount) nextPage = 1;
            return handlePagination(nextPage);
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
};
export default PaginationContainer;
