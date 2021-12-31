class Sender:
    def __init__(self, backend, *args, **kwargs) -> None:
        self.backend = backend

    def send(self, body, receiver, send_to, *args, **kwargs):
        data = receiver.compile_data
        body = body.render(data)
        self.backend.send(body, send_to, *args, **kwargs)
