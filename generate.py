from transformers import AutoTokenizer, AutoModelForCausalLM
import torch

model_name = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(model_name)

model.to("cpu")
model.config.pad_token_id = tokenizer.pad_token_id
model.config.eos_token_id = tokenizer.eos_token_id

prompt = (
    "<|system|>\nTu es un assistant qui crée des présentations informatives.\n"
    "<|user|>\nRédige un script de présentation PowerPoint en français sur le thème de la protection animale. "
    "La présentation doit comporter environ 7 diapositives. Chaque diapositive doit avoir un titre et un court texte explicatif.\n"
    "<|assistant|>\n"
)

inputs = tokenizer(prompt, return_tensors="pt")
with torch.no_grad():
    outputs = model.generate(
        **inputs,
        max_length=500,
        do_sample=True,
        temperature=0.7,
        top_k=50,
        top_p=0.95,
        repetition_penalty=1.1
    )

print("\n📄 Generated Text:\n")
print(tokenizer.decode(outputs[0], skip_special_tokens=True))
