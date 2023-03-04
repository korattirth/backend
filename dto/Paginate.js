class Paginate {
    constructor(postList,currentPage,pageSize,totalPages) {
        this.postList = postList;
        this.currentPage = currentPage;
        this.pageSize = pageSize;
        this.totalPages = totalPages
    }
}

module.exports = Paginate