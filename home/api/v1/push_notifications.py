from enum import Enum

"""
A trainer should be notified when:

1+ They have created a new class
2- Every time a client has reserved the class
3+ Every time a client has canceled the class
4- 12 hours before the class
5- New message has come in messaging
6- Client pays a trainer
7- Training session is scheduled

A client should be notified when:

8- They sign up for a class
9- 12 hours before the class begins
10- New message has come in messaging
11- Client pays a trainer
12- Training session is scheduled
"""


class Messages(Enum):
    NEW_CLASS = "You created a new class"
    NEW_CLIENT_TRAINER = "Something was sign up to your training"
    CANCEL_CLIENT_TRAINER = "Client has canceled from your class"
    BEFORE_12H_CLASS = "Your training is coming up"
    NEW_MESSAGE = "You receive a new message"
    CLIENT_PAYMENT = "Client pays to you"
    TRAINING_SCHEDULED = "Training session is scheduled"
    NEW_SIGNUP = "You was sign up to the training class"
