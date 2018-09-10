class BaseColorExtractorException(Exception):
    pass


class ValidationError(BaseColorExtractorException):
    pass


class FetchImageUrlException(BaseColorExtractorException):
    pass
