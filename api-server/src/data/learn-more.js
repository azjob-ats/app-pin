const LEARN_MORE_CONFIG = {
  stepperLearnMore: [
    {
      id: 'job-content',
      title: 'Descrição da vaga',
      layout: 'horizontal',
      elements: [
        {
          id: 'applyJob',
          type: 'textHTML',
          value: `
            <div class="text-center text-4xl font-medium">Engenheiro de Software Especialista | Python</div>
            <p><strong>💙 Sobre a Digix</strong></p>
            <p>Na Digix, somos o ecossistema que transforma o varejo brasileiro. Nossa missão é ser a parceira nº 1 do empreendedor, impulsionando seu negócio e sua vida com soluções que integram gestão, vendas, finanças e logística.</p>
            <p><strong>🚀 Como você vai fortalecer a nossa missão:</strong></p>
            <p>Seu papel como <strong>Engenheiro de Software Especialista focado em Python</strong> na Digix será implementar soluções na jornada do cliente com qualidade para que nossos clientes possam competir e crescer no mercado.</p>
            <p><strong>💪 Suas principais responsabilidades:</strong></p>
            <ul>
              <li>Desenvolver e melhorar funcionalidades, de acordo com as sprints do projeto;</li>
              <li>Desenvolver em equipe soluções compatíveis com a necessidade da empresa;</li>
              <li>Evoluir constantemente, desenvolvendo aplicações escaláveis;</li>
              <li>Melhorar a qualidade das integrações e garantir a interoperabilidade.</li>
            </ul>
            <p><strong>🔎 O que buscamos:</strong></p>
            <ul>
              <li>Experiência em HTML, CSS e JavaScript;</li>
              <li>Experiência em PostgreSQL;</li>
              <li>Experiência em boas práticas de desenvolvimento (SOLID e Clean code);</li>
              <li>Experiência em criação e manutenção de APIs REST;</li>
              <li>Conhecimento e experiência em Python.</li>
            </ul>
            <p><strong>🤩 Benefícios:</strong></p>
            <ul>
              <li>Cartão Caju — alimentação, mobilidade, home office, cultura e saúde;</li>
              <li>Plano de Saúde e Odontológico;</li>
              <li>Wellhub e TotalPass;</li>
              <li>Auxílio-creche;</li>
              <li>Terapia online.</li>
            </ul>
          `,
        },
      ],
    },
    {
      id: 'personal-info',
      title: 'Informações de contato',
      layout: 'horizontal',
      elements: [
        {
          classes: ['col-12 md:col-6'],
          type: 'text',
          id: 'firstName',
          label: 'Nome completo',
          defaultValue: null,
          placeholder: 'Informe seu nome',
          validators: { required: false },
        },
        {
          classes: ['col-12 md:col-6'],
          type: 'text',
          id: 'phone',
          label: 'Celular com DDD',
          defaultValue: null,
          placeholder: '(11) 99999-9999',
          validators: { required: false },
        },
        {
          classes: ['col-12 md:col-6'],
          type: 'text',
          id: 'linkedin',
          label: 'LinkedIn',
          defaultValue: null,
          placeholder: 'linkedin.com/in/seu-perfil',
        },
        {
          classes: ['col-12 md:col-6'],
          type: 'email',
          id: 'email',
          label: 'Seu melhor e-mail',
          defaultValue: null,
          placeholder: 'email@exemplo.com',
          validators: { required: false },
        },
        {
          classes: ['col-12 md:col-6'],
          type: 'select',
          id: 'country',
          label: 'País de origem',
          placeholder: 'Selecione',
          defaultValue: null,
          options: [
            { name: 'Brasil', code: 'br' },
            { name: 'EUA', code: 'us' },
            { name: 'Portugal', code: 'pt' },
          ],
          validators: { required: true, erroRequired: 'Este campo é obrigatório.' },
        },
        {
          classes: ['col-12 md:col-6'],
          type: 'text',
          id: 'city',
          label: 'Cidade',
          defaultValue: null,
          placeholder: 'Informe sua cidade',
          value: '',
        },
        {
          classes: ['col-12'],
          type: 'uploadFile',
          id: 'attachedResume',
          label: 'Currículo (PDF)',
          defaultValue: null,
          validators: {
            required: false,
            accept: '.pdf',
            multiple: false,
            allowedTypes: ['application/pdf'],
            maxFileSizeMB: 15,
          },
        },
        {
          classes: ['col-12'],
          type: 'checkboxAuthorize',
          id: 'authorizeDataStorage',
          label:
            'Concordo que meus dados pessoais sejam armazenados e processados pela RealWe ou terceiros, exclusivamente para fins de recrutamento e seleção.',
          placeholder: '',
          defaultValue: null,
          validators: { required: true },
        },
        {
          classes: ['col-12'],
          type: 'checkboxAuthorize',
          id: 'authorizeDataSharing',
          label:
            'Autorizo a RealWe a enviar informações através de mídias sociais, telefone e e-mail sobre novas oportunidades de emprego.',
          placeholder: '',
          defaultValue: null,
          validators: { required: true },
        },
      ],
    },
  ],
  stepperConfig: {
    showStepProgress: true,
    showCheckboxPrivacyPolicy: true,
    nameLastButton: 'Candidatar-se para a vaga',
    setRevisionStepper: true,
  },
};

module.exports = { LEARN_MORE_CONFIG };
