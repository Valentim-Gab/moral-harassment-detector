from fastapi import FastAPI

app = FastAPI()

from .similarity.controller import *
from .mistral.controller import *
from .cohere.controller import *
