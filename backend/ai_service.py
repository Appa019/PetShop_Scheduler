"""
Serviço de inteligência artificial usando a API OpenAI (modelo gpt-5.2).
Funções disponíveis:
  - analyze_pet_image: identifica raça, gera script de cuidados e perfil de doenças
  - identify_breed_mix: identifica mistura de raças para pets SRD
  - suggest_appointment_dates: gera cronograma veterinário personalizado para 5 anos
"""
import os
from typing import Optional
from openai import AsyncOpenAI
from dotenv import load_dotenv
import json

load_dotenv()

# Cliente assíncrono OpenAI — a API key é lida do .env
client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

async def analyze_pet_image(
    base64_image: str,
    pet_name: str,
    pet_age: str,
    basic_info: str,
    pet_size: str = "",
    pet_weight: str = ""
):
    """
    Sends the pet image and details to GPT-5.2 via the Responses API to identify
    the breed, generate a care script, health concerns, and a breed disease profile.
    Returns a JSON with breed, care_script, suggested_symptoms, and breed_diseases.
    """

    prompt = f"""
    Você é um veterinário especialista de alto nível da clínica '8Patas' no Brasil.
    Sua análise será usada diretamente como guia de saúde para o tutor do pet.
    Portanto, seja PRECISO, COMPLETO e PROFISSIONAL em todas as respostas.

    Informações do pet:
    - Nome: {pet_name}
    - Idade: {pet_age}
    - Porte: {pet_size if pet_size else 'Não informado'}
    - Peso aproximado: {pet_weight if pet_weight else 'Não informado'}
    - Informações adicionais / Problemas de saúde relatados: {basic_info if basic_info else 'Nenhum'}

    Analise a imagem fornecida em conjunto com todas as informações acima e execute as 4 tarefas a seguir:

    ---

    TAREFA 1 — IDENTIFICAÇÃO DA RAÇA
    Identifique a raça provável (ou mistura de raças) usando características visuais, porte, peso e toda informação disponível.
    - Se for RAÇA PURA: retorne somente o nome da raça em português (ex: "Labrador Retriever", "Golden Retriever", "Poodle Toy").
    - Se for MESTIÇO / SRD (Sem Raça Definida): retorne "SRD" seguido de até 5 raças prováveis ordenadas por dominância visual, separadas por " x ".
      Formato: "SRD - Raça1 x Raça2 x Raça3" (máximo 5 raças).
      Exemplo: "SRD - Labrador Retriever x Poodle x Beagle x Yorkshire Terrier".
    - Se não for cão/gato, identifique a espécie e raça do animal com precisão.
    - Use porte e peso para refinar: ex. porte "Pequeno" com peso "5kg" não pode ser um Labrador adulto.

    ---

    TAREFA 2 — SCRIPT DE CUIDADOS PERSONALIZADO (em Português Brasil)
    Gere um script de cuidados ESPECÍFICO para a raça/mistura identificada, considerando a idade atual ({pet_age}) e a fase de vida do pet:
    - Filhotes (< 1 ano): foco em vacinação, socialização, dentição, castração
    - Adultos (1–7 anos cães / 1–10 anos gatos): foco em prevenção, exercícios, dieta por raça
    - Seniores (7+ anos cães / 10+ anos gatos): foco em articulações, função renal/cardíaca, conforto

    Inclua obrigatoriamente:
    • Dieta recomendada para a idade e porte desta raça (marcas/tipos disponíveis no Brasil)
    • Frequência e tipo de exercícios adequados à idade atual
    • Marcos de cuidados preventivos para esta fase da vida
    • Alertas de saúde específicos da raça RELEVANTES para a idade atual

    Formato: bullet points em português. Mínimo 8 pontos, máximo 15.

    ---

    TAREFA 3 — CONDIÇÕES DE SAÚDE A MONITORAR (lista de objetos JSON)
    Liste de 6 a 10 condições/doenças às quais esta raça ou mistura de raças tem PREDISPOSIÇÃO GENÉTICA.
    Para cada condição forneça:
    - "name": nome técnico da condição em português (ex: "Displasia Coxofemoral", "Epilepsia Idiopática")
    - "description": explicação de 1 a 2 frases escritas diretamente para o tutor, sem jargão médico excessivo.
      Explique o que é e qual sinal de alerta observar em casa. Exemplo:
      "Alteração nas articulações do quadril que pode causar dor e dificuldade para se mover.
       Fique atento se o seu pet manca, tem dificuldade para se levantar ou evita subir escadas."
    Ordene por probabilidade e gravidade (mais provável/grave primeiro). NUNCA mencione IA ou análise computacional nas descrições.

    ---

    TAREFA 4 — PERFIL DE DOENÇAS DA RAÇA (em Português Brasil — texto narrativo)
    Escreva um perfil médico DETALHADO e NARRATIVO das principais doenças genéticas desta raça/mistura.
    Para cada doença principal (mínimo 3, máximo 5), escreva UM PARÁGRAFO descritivo contendo:
    • O que é a doença e como afeta o pet
    • Sinais de alerta precoce que o tutor deve observar em casa
    • Idade estimada de início dos sintomas para esta raça
    • Exames veterinários recomendados no Brasil (ex: "Radiografia de quadril OFA", "Holter 24h", "Perfil bioquímico semestral")
    • Medidas preventivas que o tutor pode adotar agora

    NÃO use bullet points — apenas parágrafos corridos. Escreva como um veterinário falaria com o tutor.
    NUNCA mencione IA, análise de imagem ou sistema computacional no texto.

    ---

    Retorne o resultado EXCLUSIVAMENTE como um objeto JSON com esta estrutura exata:
    {{
      "breed": "Raça identificada conforme regras da TAREFA 1",
      "care_script": "- Ponto 1\\n- Ponto 2\\n- Ponto 3 (mínimo 8 pontos)",
      "suggested_symptoms": [
        {{"name": "Nome da Condição", "description": "Explicação para o tutor em 1-2 frases."}},
        {{"name": "Nome da Condição 2", "description": "Explicação para o tutor em 1-2 frases."}}
      ],
      "breed_diseases": "Parágrafo sobre Doença 1...\\n\\nParágrafo sobre Doença 2...\\n\\nParágrafo sobre Doença 3..."
    }}
    """

    try:
        response = await client.responses.create(
            model="gpt-5.2",
            reasoning={"effort": "high"},
            input=[
                {
                    "role": "user",
                    "content": [
                        {"type": "input_text", "text": prompt},
                        {
                            "type": "input_image",
                            "image_url": f"data:image/jpeg;base64,{base64_image}"
                        }
                    ]
                }
            ],
            text={"format": {
                "type": "json_schema",
                "name": "pet_analysis",
                "schema": {
                    "type": "object",
                    "properties": {
                        "breed": {"type": "string"},
                        "care_script": {"type": "string"},
                        "suggested_symptoms": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "name": {"type": "string"},
                                    "description": {"type": "string"}
                                },
                                "required": ["name", "description"],
                                "additionalProperties": False
                            }
                        },
                        "breed_diseases": {"type": "string"}
                    },
                    "required": ["breed", "care_script", "suggested_symptoms", "breed_diseases"],
                    "additionalProperties": False
                },
                "strict": True
            }}
        )

        result_content = response.output_text
        return json.loads(result_content)
    except Exception as e:
        print(f"Error calling OpenAI: {e}")
        return {
            "breed": "Desconhecida",
            "care_script": "- Forneça uma dieta balanceada.\n- Garanta exercícios diários.\n- Visite o veterinário regularmente.",
            "suggested_symptoms": [
                {"name": "Apatia", "description": "Seu pet parece sem energia ou menos animado que o normal. Pode indicar dor, infecção ou outros problemas de saúde."},
                {"name": "Vômito", "description": "Episódios de vômito frequentes ou com sangue merecem atenção imediata. Podem indicar problemas digestivos ou intoxicação."},
                {"name": "Diarreia", "description": "Fezes líquidas por mais de 24h, especialmente com sangue, exigem avaliação veterinária urgente."},
                {"name": "Falta de Apetite", "description": "Recusa em comer por mais de 1 dia pode ser sinal de dor, doença ou estresse."},
                {"name": "Coceira Excessiva", "description": "Se seu pet se coça, lambe ou morde a pele constantemente, pode ter alergia ou parasitas."}
            ],
            "breed_diseases": "Não foi possível gerar o perfil de doenças. Consulte um veterinário para orientações específicas sobre sua raça."
        }

async def identify_breed_mix(base64_image: str, pet_size: str = "", pet_weight: str = ""):
    """
    Re-analyzes a pet photo specifically to determine the SRD (mixed breed) composition.
    Returns a JSON with up to 5 probable breeds in the mix.
    """

    prompt = f"""
    Você é um especialista em identificação de raças animais com décadas de experiência.

    Este pet é um SRD (Sem Raça Definida / mestiço) — não tem raça pura conhecida.
    Porte: {pet_size if pet_size else 'Não informado'}
    Peso aproximado: {pet_weight if pet_weight else 'Não informado'}

    Analise a imagem com máxima atenção e identifique a composição racial mais provável:

    CRITÉRIOS DE ANÁLISE:
    1. Formato e tamanho da cabeça (crânio, focinho, orelhas)
    2. Tipo e textura do pelo (liso, ondulado, crespo, fio, dupla camada)
    3. Estrutura corporal (proporções, dorso, membros, cauda)
    4. Padrão de cores e marcações (tricolor, merle, manchas, máscara)
    5. Porte e peso (use os dados fornecidos para validar)

    RETORNE:
    - Até 5 raças MAIS PROVÁVEIS ordenadas por dominância visual (a mais evidente primeiro)
    - Se uma característica específica for claramente identificável, mencione no campo "evidence"

    Retorne EXCLUSIVAMENTE como JSON:
    {{
      "breed": "SRD - Raça1 x Raça2 x Raça3",
      "evidence": "Breve justificativa: ex. 'Orelhas caídas e pelo ondulado sugerem Cocker Spaniel; focinho longo indica Poodle'"
    }}

    Exemplos de breed válidos:
    - {{"breed": "SRD - Labrador Retriever x Poodle x Beagle", "evidence": "Corpo de Labrador, pelo enrolado de Poodle, coloração tricolor de Beagle"}}
    - {{"breed": "SRD - Golden Retriever x Border Collie", "evidence": "Pelo dourado longo e estrutura atlética de Border Collie"}}
    - {{"breed": "SRD - Yorkshire Terrier x Maltês x Lhasa Apso", "evidence": "Porte muito pequeno, pelo longo sedoso, focinho curto"}}

    Sempre inicie com "SRD - " seguido da mistura de raças.
    """

    try:
        response = await client.responses.create(
            model="gpt-5.2",
            reasoning={"effort": "medium"},
            input=[
                {
                    "role": "user",
                    "content": [
                        {"type": "input_text", "text": prompt},
                        {
                            "type": "input_image",
                            "image_url": f"data:image/jpeg;base64,{base64_image}"
                        }
                    ]
                }
            ],
            text={"format": {
                "type": "json_schema",
                "name": "breed_mix",
                "schema": {
                    "type": "object",
                    "properties": {
                        "breed": {"type": "string"},
                        "evidence": {"type": "string"}
                    },
                    "required": ["breed", "evidence"],
                    "additionalProperties": False
                },
                "strict": True
            }}
        )

        result = json.loads(response.output_text)
        # Return only the breed field for compatibility
        return {"breed": result.get("breed", "SRD - Raça não determinada")}
    except Exception as e:
        print(f"Error calling OpenAI for breed mix: {e}")
        return {"breed": "SRD - Raça não determinada"}


async def suggest_appointment_dates(
    breed: str,
    pet_age: str,
    pet_name: str,
    pet_symptoms: Optional[list] = None,
    pet_size: str = "",
    pet_weight: str = ""
):
    """
    Uses the OpenAI Responses API to suggest appointment dates and care schedule
    based on the pet's breed, age, size, weight, and symptoms.
    Returns a JSON with suggested appointment types and intervals.
    """

    prompt = f"""
    Você é um veterinário especialista em medicina preventiva e bem-estar animal no Brasil.
    Sua tarefa é criar um CRONOGRAMA VETERINÁRIO COMPLETO de 5 anos para o pet abaixo.

    DADOS DO PET:
    - Nome: {pet_name}
    - Raça: {breed}
    - Idade atual: {pet_age}
    - Porte: {pet_size if pet_size else 'Não informado'}
    - Peso aproximado: {pet_weight if pet_weight else 'Não informado'}
    """

    if pet_symptoms and len(pet_symptoms) > 0:
        prompt += f"""
    - Sintomas/Condições Relatados: {', '.join(pet_symptoms)}
    ⚠️ URGENTE: Os sintomas acima requerem atenção IMEDIATA. Inclua consultas urgentes nos primeiros dias
    do cronograma. Priorize exames diagnósticos relacionados especificamente a esses sintomas.
    """

    prompt += f"""

    FASE DE VIDA ATUAL:
    O pet tem {pet_age}. Calibre TODAS as recomendações para esta fase:
    - Filhotes/Gatinhos (< 1 ano): série vacinal completa, vermifugação mensal, castração, socialização
    - Adultos Jovens (1–3 anos): prevenção ativa, exames anuais de rotina, dental
    - Adultos (3–7 anos cães / 3–10 anos gatos): rastreio de condições predispostas, bioquímica semestral
    - Seniores (7+ anos cães / 10+ anos gatos): painel geriátrico completo, monitoramento órgãos, conforto

    EXIGÊNCIAS ESPECÍFICAS DA RAÇA "{breed}":
    Você DEVE incluir os exames de rastreio especificamente recomendados para esta raça no Brasil:
    • Raças grandes/gigantes (Pastor Alemão, Labrador, Golden, Rottweiler, etc.):
      → Radiografia de quadril (displasia coxofemoral OFA), Ecocardiograma, Perfil bioquímico renal
    • Raças braquicefálicas (Bulldog, Pug, Shih Tzu, Persa, etc.):
      → Avaliação de via aérea superior, Exame oftalmológico semestral, Controle de peso rigoroso
    • Raças pequenas (Yorkshire, Chihuahua, Maltês, Poodle Toy, etc.):
      → Limpeza dental profilática semestral, Radiografia de joelho (luxação de patela), Avaliação cardíaca
    • Raças com predisposição cardíaca (Cavalier King Charles, Dobermann, Boxer, etc.):
      → Holter 24h anual, Ecocardiograma semestral, Rastreio de troponina
    • SRD (mistura de raças): inclua exames para as raças presentes na mistura identificada

    INSTRUÇÕES PARA O CRONOGRAMA:
    1. Gere entre 25 e 35 consultas/exames cobrindo os próximos 5 anos (até 1825 dias)
    2. Use nomes ESPECÍFICOS e COMPLETOS em português: NÃO use "Checkup" ou "Vacinas" genéricos.
       Use: "Vacina V10 — Reforço Anual", "Limpeza Dental Profilática sob Anestesia",
       "Radiografia de Quadril Bilateral (Rastreio Displasia)", "Ecocardiograma Preventivo",
       "Hemograma + Bioquímica Renal + Hepática", "Exame Parasitológico de Fezes", etc.
    3. Inclua vermifugações periódicas (a cada 3–6 meses dependendo da idade)
    4. Inclua prevenção de heartworm e pulgas/carrapatos (importantes no Brasil)
    5. Para filhotes: série vacinal (V8/V10 aos 45d, 60d, 90d, 120d + reforço anual)
    6. Para seniores: adicione Perfil Geriátrico Completo a cada 6 meses
    7. Se houver sintomas: primeiras consultas devem ser urgentes (interval_days: 1–7)
    8. OBRIGATÓRIO — CUIDADOS DE HIGIENE E BEM-ESTAR (inclua todos):
       • "Banho Higiênico Completo" — a cada 15-30 dias (ajuste conforme raça/pelagem)
       • "Tosa Higiênica" — a cada 30-60 dias (raças com pelo longo: tosa completa a cada 45-60 dias)
       • "Corte de Unhas" — a cada 30-45 dias
       • "Limpeza de Ouvidos" — a cada 15-30 dias (raças de orelha caída: quinzenal)
       • "Escovação Dental em Casa" — lembrete a cada 90 dias
       Esses itens devem ter priority "low" e devem se repetir ao longo dos 5 anos.
       Para raças de pelo longo (Shih Tzu, Lhasa, Maltês, Poodle, etc.) aumente a frequência de tosa.

    Retorne EXCLUSIVAMENTE como JSON com esta estrutura:
    {{
      "appointments": [
        {{
          "type": "Nome específico e completo da consulta/exame em PT-BR",
          "interval_days": 30,
          "priority": "high",
          "reason": "Justificativa clínica específica para esta raça/idade"
        }}
      ],
      "next_recommended": "Nome da consulta mais urgente que deve ser agendada primeiro"
    }}

    Níveis de prioridade: "high" (urgente/crítico), "medium" (importante/preventivo), "low" (eletivo/bem-estar)
    """

    try:
        response = await client.responses.create(
            model="gpt-5.2",
            reasoning={"effort": "high"},
            input=[
                {
                    "role": "user",
                    "content": [
                        {"type": "input_text", "text": prompt}
                    ]
                }
            ],
            text={"format": {
                "type": "json_schema",
                "name": "appointment_schedule",
                "schema": {
                    "type": "object",
                    "properties": {
                        "appointments": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "type": {"type": "string"},
                                    "interval_days": {"type": "integer"},
                                    "priority": {"type": "string", "enum": ["high", "medium", "low"]},
                                    "reason": {"type": "string"}
                                },
                                "required": ["type", "interval_days", "priority", "reason"],
                                "additionalProperties": False
                            }
                        },
                        "next_recommended": {"type": "string"}
                    },
                    "required": ["appointments", "next_recommended"],
                    "additionalProperties": False
                },
                "strict": True
            }}
        )

        result_content = response.output_text
        return json.loads(result_content)
    except Exception as e:
        print(f"Error calling OpenAI for appointment suggestions: {e}")
        return {
            "appointments": [
                {
                    "type": "Consulta Clínica Geral",
                    "interval_days": 30,
                    "priority": "high",
                    "reason": "Avaliação de saúde geral e criação do prontuário"
                },
                {
                    "type": "Vacina V10 — Reforço Anual",
                    "interval_days": 365,
                    "priority": "high",
                    "reason": "Atualização do protocolo vacinal anual"
                },
                {
                    "type": "Hemograma + Bioquímica Sérica",
                    "interval_days": 180,
                    "priority": "medium",
                    "reason": "Exames laboratoriais de rotina semestral"
                }
            ],
            "next_recommended": "Consulta Clínica Geral"
        }
