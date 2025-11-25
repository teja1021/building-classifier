BACKEND MODEL FILES README
==========================

EXPECTED MODEL NAMING CONVENTION
---------------------------------

The inference system looks for pre-trained PyTorch models in the following order:
  1. models/resnet18_best.pt
  2. models/ensemble.pt
  3. models/model.pt

If no model files are found, the system automatically falls back to MOCK INFERENCE,
which returns deterministic predictions based on image content hashing.

LOADING YOUR OWN MODEL
----------------------

1. Save your trained model using torch.save():
   
   Example:
   ```python
   import torch
   # After training...
   torch.save(model, "backend/app/models/resnet18_best.pt")
   ```

2. Or export to TorchScript for faster inference:
   
   ```python
   scripted_model = torch.jit.script(model)
   scripted_model.save("backend/app/models/resnet18_best.pt")
   ```

3. Restart the backend server - it will automatically load the model on startup.

MODEL REQUIREMENTS
-------------------

- INPUT SIZE: 224x224 pixels (ImageNet standard)
- NORMALIZATION: ImageNet mean/std
  - mean = [0.485, 0.456, 0.406]
  - std = [0.229, 0.224, 0.225]
  
- INPUT CHANNELS: 3 (RGB)
- OUTPUT: Logits tensor of shape (batch_size, num_classes)
  where num_classes matches len(labels.json)

- RECOMMENDED ARCHITECTURE: ResNet18 (pretrained on ImageNet)
  For different architectures, you may need to modify inference.py

CLASS ORDERING
---------------

The model's output classes must match the order in backend/app/labels.json:
  Index 0 -> "CSE Building"
  Index 1 -> "ECE Building"
  Index 2 -> "Mechanical Building"
  ...and so on

MISMATCH = INCORRECT PREDICTIONS

If you retrain with a different class ordering, update labels.json accordingly.

DEVICE SUPPORT
---------------

- GPU: Automatically uses CUDA if available
- CPU: Falls back to CPU if GPU not available
- Set in inference.py: DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

OPTIMIZATION OPTIONS
---------------------

For production deployment, consider:

1. ONNX Export (for cross-platform inference):
   ```python
   import torch.onnx
   torch.onnx.export(model, dummy_input, "model.onnx", ...)
   ```
   Then modify inference.py to use ONNX Runtime

2. TorchScript Quantization (for smaller model size):
   ```python
   quantized = torch.quantization.quantize_dynamic(model, ...)
   torch.jit.save(torch.jit.script(quantized), "model_quantized.pt")
   ```

3. Distillation (train smaller model from larger one)

TROUBLESHOOTING
----------------

1. Model not loading?
   - Check file exists at backend/app/models/resnet18_best.pt
   - Check file is valid PyTorch (.pt or .pth)
   - Check device compatibility (GPU vs CPU)
   - Check backend logs for error messages

2. Predictions incorrect?
   - Verify class ordering matches labels.json
   - Check image preprocessing (224x224, ImageNet normalization)
   - Verify model was trained with same preprocessing

3. Slow inference?
   - Use GPU if available (CUDA)
   - Consider TorchScript or ONNX export
   - Use smaller model (MobileNet, EfficientNet)

MOCK INFERENCE
---------------

When no model is present, the system returns deterministic mock predictions:
- Uses MD5 hash of image bytes for reproducibility
- Samples 5 random labels and assigns probabilities
- Perfect for UI testing without a real model

Mock predictions are clearly marked in the "notes" field.

For more details, see inference.py and main.py
