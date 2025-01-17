import os
from tempfile import SpooledTemporaryFile

from storages.backends.s3boto3 import S3Boto3Storage


class MediaStorage(S3Boto3Storage):
    location = "media"
    file_overwrite = False
    default_acl = "public-read"

    def _save(self, name, content):
        content.seek(0, os.SEEK_SET)

        with SpooledTemporaryFile() as content_autoclose:
            content_autoclose.write(content.read())
            return super(MediaStorage, self)._save(name, content_autoclose)
