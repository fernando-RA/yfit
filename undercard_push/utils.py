from django.template import Context
from django.template import Template
import typing as T
import sys


def both_p(*args, **kwargs):
    sys.stderr.write(*args, **kwargs)
    sys.stderr.write("\n")
    sys.stdout.write(*args, **kwargs)
    sys.stdout.write("\n")

def jinjize(tpl: T.AnyStr, **context):
    """shortcut to render a jinja2 template with a context."""
    if not tpl:
        return None
    try:
        t = Template(tpl)
        ctx = Context(context)
        return t.render(ctx)
    except Exception as exc:
        both_p(f"ERROR UNDERCARD: Could not format template string '{tpl}'")
        both_p(str(exc))
