from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
import spacy

nlp = spacy.load("en_core_web_sm")

emotion_model_classification = 0

class EmotionView(APIView):
    def post(self,request):
        text = request.data.get("text","")
        if not text:
            return Response({"error": "No text provided"},status=400)
        
        doc = nlp(text.lower())
        tokens = [token.lemma_ for token in doc if token.is_alpha and not token.is_stop]
        result = emotion_model_classification(''.join(tokens))[0]

        return Response({"emotion" : result['label'], "score": result['score']})