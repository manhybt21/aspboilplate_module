using Abp.Auditing;
using Abp.MimeTypes;
using AbpCompanyName.AbpProjectName.Storage;
using Microsoft.AspNetCore.Mvc;

namespace AbpCompanyName.AbpProjectName.Controllers
{
    public class FileController : AbpProjectNameControllerBase
    {
        private readonly ITempFileCacheManager _tempFileCacheManager;

        public FileController(
            ITempFileCacheManager tempFileCacheManager,
            IMimeTypeMap mimeTypeMap
        )
        {
            _tempFileCacheManager = tempFileCacheManager;
        }
        [DisableAuditing]
        public ActionResult DownloadTempFile(FileDto file)
        {
            var fileBytes = _tempFileCacheManager.GetFile(file.FileToken);
            if (fileBytes == null)
            {
                return NotFound(L("RequestedFileDoesNotExists"));
            }

            return File(fileBytes, file.FileType, file.FileName);
        }
    }
}
