tá veja minha estrutura novamente e confere se os comandos que vc me deu atualmente nao vai quebrar nada, se essa abordagem Abordagem: Hierarquia com parent_id + path (Materialized Path) vai ser ao mesmo tempo a mais fácil de implementar e a melhor no quesito escalabilidade geral, e me faça uma lista dos arquivos do back-end que eu tenho que te mandar pra vc fazer as alterções necessárias, veja a estrutura do backend e liste os arquivos que é pra eu te mandar pra vc corrijir:│   │   │   ├── Campo.js.map
│   │   │   ├── Categoria.d.ts
│   │   │   ├── Categoria.d.ts.map
│   │   │   ├── Categoria.js
│   │   │   ├── Categoria.js.map
│   │   │   ├── Colecao.d.ts
│   │   │   ├── Colecao.d.ts.map
│   │   │   ├── Colecao.js
│   │   │   ├── Colecao.js.map
│   │   │   ├── Conquista.d.ts
│   │   │   ├── Conquista.d.ts.map
│   │   │   ├── Conquista.js
│   │   │   ├── Conquista.js.map
│   │   │   ├── EnergyLog.d.ts
│   │   │   ├── EnergyLog.d.ts.map
│   │   │   ├── EnergyLog.js
│   │   │   ├── EnergyLog.js.map
│   │   │   ├── Habito.d.ts
│   │   │   ├── Habito.d.ts.map
│   │   │   ├── Habito.js
│   │   │   ├── Habito.js.map
│   │   │   ├── HabitoRegistro.d.ts
│   │   │   ├── HabitoRegistro.d.ts.map
│   │   │   ├── HabitoRegistro.js
│   │   │   ├── HabitoRegistro.js.map
│   │   │   ├── Item.d.ts
│   │   │   ├── Item.d.ts.map
│   │   │   ├── Item.js
│   │   │   ├── Item.js.map
│   │   │   ├── ItemLista.d.ts
│   │   │   ├── ItemLista.d.ts.map
│   │   │   ├── ItemLista.js
│   │   │   ├── ItemLista.js.map
│   │   │   ├── ItemValor.d.ts
│   │   │   ├── ItemValor.d.ts.map
│   │   │   ├── ItemValor.js
│   │   │   ├── ItemValor.js.map
│   │   │   ├── Lista.d.ts
│   │   │   ├── Lista.d.ts.map
│   │   │   ├── Lista.js
│   │   │   ├── Lista.js.map
│   │   │   ├── Meta.d.ts
│   │   │   ├── Meta.d.ts.map
│   │   │   ├── Meta.js
│   │   │   ├── Meta.js.map
│   │   │   ├── Notification.d.ts
│   │   │   ├── Notification.d.ts.map
│   │   │   ├── Notification.js
│   │   │   ├── Notification.js.map
│   │   │   ├── Nucleo.d.ts
│   │   │   ├── Nucleo.d.ts.map
│   │   │   ├── Nucleo.js
│   │   │   ├── Nucleo.js.map
│   │   │   ├── NucleoAchievement.d.ts
│   │   │   ├── NucleoAchievement.d.ts.map
│   │   │   ├── NucleoAchievement.js
│   │   │   ├── NucleoAchievement.js.map
│   │   │   ├── NucleoCompartilhamento.d.ts
│   │   │   ├── NucleoCompartilhamento.d.ts.map
│   │   │   ├── NucleoCompartilhamento.js
│   │   │   ├── NucleoCompartilhamento.js.map
│   │   │   ├── NucleoIcon.d.ts
│   │   │   ├── NucleoIcon.d.ts.map
│   │   │   ├── NucleoIcon.js
│   │   │   ├── NucleoIcon.js.map
│   │   │   ├── NucleoRelation.d.ts
│   │   │   ├── NucleoRelation.d.ts.map
│   │   │   ├── NucleoRelation.js
│   │   │   ├── NucleoRelation.js.map
│   │   │   ├── NucleoTimer.d.ts
│   │   │   ├── NucleoTimer.d.ts.map
│   │   │   ├── NucleoTimer.js
│   │   │   ├── NucleoTimer.js.map
│   │   │   ├── PasswordReset.d.ts
│   │   │   ├── PasswordReset.d.ts.map
│   │   │   ├── PasswordReset.js
│   │   │   ├── PasswordReset.js.map
│   │   │   ├── Plan.d.ts
│   │   │   ├── Plan.d.ts.map
│   │   │   ├── Plan.js
│   │   │   ├── Plan.js.map
│   │   │   ├── Streak.d.ts
│   │   │   ├── Streak.d.ts.map
│   │   │   ├── Streak.js
│   │   │   ├── Streak.js.map
│   │   │   ├── Subscription.d.ts
│   │   │   ├── Subscription.d.ts.map
│   │   │   ├── Subscription.js
│   │   │   ├── Subscription.js.map
│   │   │   ├── Tarefa.d.ts
│   │   │   ├── Tarefa.d.ts.map
│   │   │   ├── Tarefa.js
│   │   │   ├── Tarefa.js.map
│   │   │   ├── Timer.d.ts
│   │   │   ├── Timer.d.ts.map
│   │   │   ├── Timer.js
│   │   │   ├── Timer.js.map
│   │   │   ├── User.d.ts
│   │   │   ├── User.d.ts.map
│   │   │   ├── User.js
│   │   │   ├── User.js.map
│   │   │   ├── UserConquista.d.ts
│   │   │   ├── UserConquista.d.ts.map
│   │   │   ├── UserConquista.js
│   │   │   ├── UserConquista.js.map
│   │   │   ├── UserLevel.d.ts
│   │   │   ├── UserLevel.d.ts.map
│   │   │   ├── UserLevel.js
│   │   │   ├── UserLevel.js.map
│   │   │   ├── UserPreference.d.ts
│   │   │   ├── UserPreference.d.ts.map
│   │   │   ├── UserPreference.js
│   │   │   ├── UserPreference.js.map
│   │   │   ├── UserProfile.d.ts
│   │   │   ├── UserProfile.d.ts.map
│   │   │   ├── UserProfile.js
│   │   │   ├── UserProfile.js.map
│   │   │   ├── UserRole.d.ts
│   │   │   ├── UserRole.d.ts.map
│   │   │   ├── UserRole.js
│   │   │   ├── UserRole.js.map
│   │   │   ├── UserSecurity.d.ts
│   │   │   ├── UserSecurity.d.ts.map
│   │   │   ├── UserSecurity.js
│   │   │   ├── UserSecurity.js.map
│   │   │   ├── XpLog.d.ts
│   │   │   ├── XpLog.d.ts.map
│   │   │   ├── XpLog.js
│   │   │   ├── XpLog.js.map
│   │   │   ├── base.entity.d.ts
│   │   │   ├── base.entity.d.ts.map
│   │   │   ├── base.entity.js
│   │   │   └── base.entity.js.map
│   │   ├── enums
│   │   │   ├── AchievementType.d.ts
│   │   │   ├── AchievementType.d.ts.map
│   │   │   ├── AchievementType.js
│   │   │   ├── AchievementType.js.map
│   │   │   ├── InsightType.d.ts
│   │   │   ├── InsightType.d.ts.map
│   │   │   ├── InsightType.js
│   │   │   ├── InsightType.js.map
│   │   │   ├── UserRoleEnum.d.ts
│   │   │   ├── UserRoleEnum.d.ts.map
│   │   │   ├── UserRoleEnum.js
│   │   │   ├── UserRoleEnum.js.map
│   │   │   ├── tipo-bloco.enum.d.ts
│   │   │   ├── tipo-bloco.enum.d.ts.map
│   │   │   ├── tipo-bloco.enum.js
│   │   │   ├── tipo-bloco.enum.js.map
│   │   │   ├── tipo-nucleo.enum.d.ts
│   │   │   ├── tipo-nucleo.enum.d.ts.map
│   │   │   ├── tipo-nucleo.enum.js
│   │   │   └── tipo-nucleo.enum.js.map
│   │   ├── events
│   │   │   ├── BlocoCriadoEvent.d.ts
│   │   │   ├── BlocoCriadoEvent.d.ts.map
│   │   │   ├── BlocoCriadoEvent.js
│   │   │   ├── BlocoCriadoEvent.js.map
│   │   │   ├── HabitoRegistradoEvent.d.ts
│   │   │   ├── HabitoRegistradoEvent.d.ts.map
│   │   │   ├── HabitoRegistradoEvent.js
│   │   │   ├── HabitoRegistradoEvent.js.map
│   │   │   ├── ItemListaCheckedEvent.d.ts
│   │   │   ├── ItemListaCheckedEvent.d.ts.map
│   │   │   ├── ItemListaCheckedEvent.js
│   │   │   ├── ItemListaCheckedEvent.js.map
│   │   │   ├── NivelAlcancadoEvent.d.ts
│   │   │   ├── NivelAlcancadoEvent.d.ts.map
│   │   │   ├── NivelAlcancadoEvent.js
│   │   │   ├── NivelAlcancadoEvent.js.map
│   │   │   ├── NucleoCriadoEvent.d.ts
│   │   │   ├── NucleoCriadoEvent.d.ts.map
│   │   │   ├── NucleoCriadoEvent.js
│   │   │   ├── NucleoCriadoEvent.js.map
│   │   │   ├── TarefaConcluidaEvent.d.ts
│   │   │   ├── TarefaConcluidaEvent.d.ts.map
│   │   │   ├── TarefaConcluidaEvent.js
│   │   │   ├── TarefaConcluidaEvent.js.map
│   │   │   ├── TimerCompletadoEvent.d.ts
│   │   │   ├── TimerCompletadoEvent.d.ts.map
│   │   │   ├── TimerCompletadoEvent.js
│   │   │   ├── TimerCompletadoEvent.js.map
│   │   │   ├── UserLoginEvent.d.ts
│   │   │   ├── UserLoginEvent.d.ts.map
│   │   │   ├── UserLoginEvent.js
│   │   │   ├── UserLoginEvent.js.map
│   │   │   ├── XPGanhoEvent.d.ts
│   │   │   ├── XPGanhoEvent.d.ts.map
│   │   │   ├── XPGanhoEvent.js
│   │   │   └── XPGanhoEvent.js.map
│   │   ├── exceptions
│   │   │   ├── BusinessRuleException.d.ts
│   │   │   ├── BusinessRuleException.d.ts.map
│   │   │   ├── BusinessRuleException.js
│   │   │   ├── BusinessRuleException.js.map
│   │   │   ├── DomainException.d.ts
│   │   │   ├── DomainException.d.ts.map
│   │   │   ├── DomainException.js
│   │   │   ├── DomainException.js.map
│   │   │   ├── NotFoundException.d.ts
│   │   │   ├── NotFoundException.d.ts.map
│   │   │   ├── NotFoundException.js
│   │   │   ├── NotFoundException.js.map
│   │   │   ├── UnauthorizedException.d.ts
│   │   │   ├── UnauthorizedException.d.ts.map
│   │   │   ├── UnauthorizedException.js
│   │   │   └── UnauthorizedException.js.map
│   │   ├── repositories
│   │   │   ├── IBlocoRepository.d.ts
│   │   │   ├── IBlocoRepository.d.ts.map
│   │   │   ├── IBlocoRepository.js
│   │   │   ├── IBlocoRepository.js.map
│   │   │   ├── ICalendarioRepository.d.ts
│   │   │   ├── ICalendarioRepository.d.ts.map
│   │   │   ├── ICalendarioRepository.js
│   │   │   ├── ICalendarioRepository.js.map
│   │   │   ├── IColecaoRepository.d.ts
│   │   │   ├── IColecaoRepository.d.ts.map
│   │   │   ├── IColecaoRepository.js
│   │   │   ├── IColecaoRepository.js.map
│   │   │   ├── IConquistaRepository.d.ts
│   │   │   ├── IConquistaRepository.d.ts.map
│   │   │   ├── IConquistaRepository.js
│   │   │   ├── IConquistaRepository.js.map
│   │   │   ├── IHabitoRepository.d.ts
│   │   │   ├── IHabitoRepository.d.ts.map
│   │   │   ├── IHabitoRepository.js
│   │   │   ├── IHabitoRepository.js.map
│   │   │   ├── IListaRepository.d.ts
│   │   │   ├── IListaRepository.d.ts.map
│   │   │   ├── IListaRepository.js
│   │   │   ├── IListaRepository.js.map
│   │   │   ├── INucleoRepository.d.ts
│   │   │   ├── INucleoRepository.d.ts.map
│   │   │   ├── INucleoRepository.js
│   │   │   ├── INucleoRepository.js.map
│   │   │   ├── IStreakRepository.d.ts
│   │   │   ├── IStreakRepository.d.ts.map
│   │   │   ├── IStreakRepository.js
│   │   │   ├── IStreakRepository.js.map
│   │   │   ├── ITarefaRepository.d.ts
│   │   │   ├── ITarefaRepository.d.ts.map
│   │   │   ├── ITarefaRepository.js
│   │   │   ├── ITarefaRepository.js.map
│   │   │   ├── IUserLevelRepository.d.ts
│   │   │   ├── IUserLevelRepository.d.ts.map
│   │   │   ├── IUserLevelRepository.js
│   │   │   ├── IUserLevelRepository.js.map
│   │   │   ├── IUserRepository.d.ts
│   │   │   ├── IUserRepository.d.ts.map
│   │   │   ├── IUserRepository.js
│   │   │   └── IUserRepository.js.map
│   │   ├── services
│   │   │   ├── GamificacaoDomainService.d.ts
│   │   │   ├── GamificacaoDomainService.d.ts.map
│   │   │   ├── GamificacaoDomainService.js
│   │   │   ├── GamificacaoDomainService.js.map
│   │   │   ├── HabitoDomainService.d.ts
│   │   │   ├── HabitoDomainService.d.ts.map
│   │   │   ├── HabitoDomainService.js
│   │   │   ├── HabitoDomainService.js.map
│   │   │   ├── NucleoDomainService.d.ts
│   │   │   ├── NucleoDomainService.d.ts.map
│   │   │   ├── NucleoDomainService.js
│   │   │   ├── NucleoDomainService.js.map
│   │   │   ├── StreakDomainService.d.ts
│   │   │   ├── StreakDomainService.d.ts.map
│   │   │   ├── StreakDomainService.js
│   │   │   ├── StreakDomainService.js.map
│   │   │   ├── TarefaDomainService.d.ts
│   │   │   ├── TarefaDomainService.d.ts.map
│   │   │   ├── TarefaDomainService.js
│   │   │   ├── TarefaDomainService.js.map
│   │   │   ├── XPDomainService.d.ts
│   │   │   ├── XPDomainService.d.ts.map
│   │   │   ├── XPDomainService.js
│   │   │   └── XPDomainService.js.map
│   │   └── value-objects
│   │       ├── CPF.d.ts
│   │       ├── CPF.d.ts.map
│   │       ├── CPF.js
│   │       ├── CPF.js.map
│   │       ├── Email.d.ts
│   │       ├── Email.d.ts.map
│   │       ├── Email.js
│   │       ├── Email.js.map
│   │       ├── FrequenciaHabito.d.ts
│   │       ├── FrequenciaHabito.d.ts.map
│   │       ├── FrequenciaHabito.js
│   │       ├── FrequenciaHabito.js.map
│   │       ├── PermissionLevel.d.ts
│   │       ├── PermissionLevel.d.ts.map
│   │       ├── PermissionLevel.js
│   │       ├── PermissionLevel.js.map
│   │       ├── PrioridadeTarefa.d.ts
│   │       ├── PrioridadeTarefa.d.ts.map
│   │       ├── PrioridadeTarefa.js
│   │       ├── PrioridadeTarefa.js.map
│   │       ├── StatusTarefa.d.ts
│   │       ├── StatusTarefa.d.ts.map
│   │       ├── StatusTarefa.js
│   │       ├── StatusTarefa.js.map
│   │       ├── TipoBloco.d.ts
│   │       ├── TipoBloco.d.ts.map
│   │       ├── TipoBloco.js
│   │       ├── TipoBloco.js.map
│   │       ├── TipoLista.d.ts
│   │       ├── TipoLista.d.ts.map
│   │       ├── TipoLista.js
│   │       ├── TipoLista.js.map
│   │       ├── TipoNucleo.d.ts
│   │       ├── TipoNucleo.d.ts.map
│   │       ├── TipoNucleo.js
│   │       └── TipoNucleo.js.map
│   ├── infrastructure
│   │   ├── cache
│   │   │   ├── cache.service.d.ts
│   │   │   ├── cache.service.d.ts.map
│   │   │   ├── cache.service.js
│   │   │   ├── cache.service.js.map
│   │   │   ├── redis.service.d.ts
│   │   │   ├── redis.service.d.ts.map
│   │   │   ├── redis.service.js
│   │   │   └── redis.service.js.map
│   │   ├── di
│   │   │   ├── container.d.ts
│   │   │   ├── container.d.ts.map
│   │   │   ├── container.js
│   │   │   ├── container.js.map
│   │   │   ├── timer-handlers.registry.d.ts
│   │   │   ├── timer-handlers.registry.d.ts.map
│   │   │   ├── timer-handlers.registry.js
│   │   │   └── timer-handlers.registry.js.map
│   │   ├── gamification
│   │   │   ├── index.d.ts
│   │   │   ├── index.d.ts.map
│   │   │   ├── index.js
│   │   │   └── index.js.map
│   │   ├── persistence
│   │   │   ├── db
│   │   │   │   ├── connection.d.ts
│   │   │   │   ├── connection.d.ts.map
│   │   │   │   ├── connection.js
│   │   │   │   ├── connection.js.map
│   │   │   │   ├── query-builder.d.ts
│   │   │   │   ├── query-builder.d.ts.map
│   │   │   │   ├── query-builder.js
│   │   │   │   ├── query-builder.js.map
│   │   │   │   ├── supabase.d.ts
│   │   │   │   ├── supabase.d.ts.map
│   │   │   │   ├── supabase.js
│   │   │   │   ├── supabase.js.map
│   │   │   │   ├── unit-of-work.d.ts
│   │   │   │   ├── unit-of-work.d.ts.map
│   │   │   │   ├── unit-of-work.js
│   │   │   │   └── unit-of-work.js.map
│   │   │   ├── repositories
│   │   │   │   ├── BaseRepository.d.ts
│   │   │   │   ├── BaseRepository.d.ts.map
│   │   │   │   ├── BaseRepository.js
│   │   │   │   ├── BaseRepository.js.map
│   │   │   │   ├── BlocoRepository.d.ts
│   │   │   │   ├── BlocoRepository.d.ts.map
│   │   │   │   ├── BlocoRepository.js
│   │   │   │   ├── BlocoRepository.js.map
│   │   │   │   ├── CalendarioRepository.d.ts
│   │   │   │   ├── CalendarioRepository.d.ts.map
│   │   │   │   ├── CalendarioRepository.js
│   │   │   │   ├── CalendarioRepository.js.map
│   │   │   │   ├── ColecaoRepository.d.ts
│   │   │   │   ├── ColecaoRepository.d.ts.map
│   │   │   │   ├── ColecaoRepository.js
│   │   │   │   ├── ColecaoRepository.js.map
│   │   │   │   ├── ConquistaRepository.d.ts
│   │   │   │   ├── ConquistaRepository.d.ts.map
│   │   │   │   ├── ConquistaRepository.js
│   │   │   │   ├── ConquistaRepository.js.map
│   │   │   │   ├── HabitoRepository.d.ts
│   │   │   │   ├── HabitoRepository.d.ts.map
│   │   │   │   ├── HabitoRepository.js
│   │   │   │   ├── HabitoRepository.js.map
│   │   │   │   ├── ListaRepository.d.ts
│   │   │   │   ├── ListaRepository.d.ts.map
│   │   │   │   ├── ListaRepository.js
│   │   │   │   ├── ListaRepository.js.map
│   │   │   │   ├── NucleoIconRepository.d.ts
│   │   │   │   ├── NucleoIconRepository.d.ts.map
│   │   │   │   ├── NucleoIconRepository.js
│   │   │   │   ├── NucleoIconRepository.js.map
│   │   │   │   ├── NucleoRepository.d.ts
│   │   │   │   ├── NucleoRepository.d.ts.map
│   │   │   │   ├── NucleoRepository.js
│   │   │   │   ├── NucleoRepository.js.map
│   │   │   │   ├── StreakRepository.d.ts
│   │   │   │   ├── StreakRepository.d.ts.map
│   │   │   │   ├── StreakRepository.js
│   │   │   │   ├── StreakRepository.js.map
│   │   │   │   ├── TarefaRepository.d.ts
│   │   │   │   ├── TarefaRepository.d.ts.map
│   │   │   │   ├── TarefaRepository.js
│   │   │   │   ├── TarefaRepository.js.map
│   │   │   │   ├── TimerRepository.d.ts
│   │   │   │   ├── TimerRepository.d.ts.map
│   │   │   │   ├── TimerRepository.js
│   │   │   │   ├── TimerRepository.js.map
│   │   │   │   ├── UserLevelRepository.d.ts
│   │   │   │   ├── UserLevelRepository.d.ts.map
│   │   │   │   ├── UserLevelRepository.js
│   │   │   │   ├── UserLevelRepository.js.map
│   │   │   │   ├── UserRepository.d.ts
│   │   │   │   ├── UserRepository.d.ts.map
│   │   │   │   ├── UserRepository.js
│   │   │   │   ├── UserRepository.js.map
│   │   │   │   ├── XpLogRepository.d.ts
│   │   │   │   ├── XpLogRepository.d.ts.map
│   │   │   │   ├── XpLogRepository.js
│   │   │   │   └── XpLogRepository.js.map
│   │   │   └── seed
│   │   │       ├── seed-conquistas.d.ts
│   │   │       ├── seed-conquistas.d.ts.map
│   │   │       ├── seed-conquistas.js
│   │   │       ├── seed-conquistas.js.map
│   │   │       ├── seed-plans.d.ts
│   │   │       ├── seed-plans.d.ts.map
│   │   │       ├── seed-plans.js
│   │   │       └── seed-plans.js.map
│   │   ├── queue
│   │   │   ├── bull.service.d.ts
│   │   │   ├── bull.service.d.ts.map
│   │   │   ├── bull.service.js
│   │   │   ├── bull.service.js.map
│   │   │   ├── queue.service.d.ts
│   │   │   ├── queue.service.d.ts.map
│   │   │   ├── queue.service.js
│   │   │   └── queue.service.js.map
│   │   └── services
│   │       ├── GamificationService.d.ts
│   │       ├── GamificationService.d.ts.map
│   │       ├── GamificationService.js
│   │       ├── GamificationService.js.map
│   │       ├── LevelService.d.ts
│   │       ├── LevelService.d.ts.map
│   │       ├── LevelService.js
│   │       ├── LevelService.js.map
│   │       ├── StreakDomainService.d.ts
│   │       ├── StreakDomainService.d.ts.map
│   │       ├── StreakDomainService.js
│   │       ├── StreakDomainService.js.map
│   │       ├── XPDomainService.d.ts
│   │       ├── XPDomainService.d.ts.map
│   │       ├── XPDomainService.js
│   │       ├── XPDomainService.js.map
│   │       ├── bcrypt.service.d.ts
│   │       ├── bcrypt.service.d.ts.map
│   │       ├── bcrypt.service.js
│   │       ├── bcrypt.service.js.map
│   │       ├── current-user.service.d.ts
│   │       ├── current-user.service.d.ts.map
│   │       ├── current-user.service.js
│   │       ├── current-user.service.js.map
│   │       ├── date-time.provider.d.ts
│   │       ├── date-time.provider.d.ts.map
│   │       ├── date-time.provider.js
│   │       ├── date-time.provider.js.map
│   │       ├── email.service.d.ts
│   │       ├── email.service.d.ts.map
│   │       ├── email.service.js
│   │       ├── email.service.js.map
│   │       ├── jwt.service.d.ts
│   │       ├── jwt.service.d.ts.map
│   │       ├── jwt.service.js
│   │       ├── jwt.service.js.map
│   │       ├── openai.service.d.ts
│   │       ├── openai.service.d.ts.map
│   │       ├── openai.service.js
│   │       ├── openai.service.js.map
│   │       ├── storage.service.d.ts
│   │       ├── storage.service.d.ts.map
│   │       ├── storage.service.js
│   │       └── storage.service.js.map
│   ├── jobs
│   │   ├── calculate-streaks.job.d.ts
│   │   ├── calculate-streaks.job.d.ts.map
│   │   ├── calculate-streaks.job.js
│   │   ├── calculate-streaks.job.js.map
│   │   ├── generate-insights.job.d.ts
│   │   ├── generate-insights.job.d.ts.map
│   │   ├── generate-insights.job.js
│   │   ├── generate-insights.job.js.map
│   │   ├── index.d.ts
│   │   ├── index.d.ts.map
│   │   ├── index.js
│   │   ├── index.js.map
│   │   ├── send-notifications.job.d.ts
│   │   ├── send-notifications.job.d.ts.map
│   │   ├── send-notifications.job.js
│   │   └── send-notifications.job.js.map
│   ├── shared
│   │   ├── EventDispatcher.d.ts
│   │   ├── EventDispatcher.d.ts.map
│   │   ├── EventDispatcher.js
│   │   ├── EventDispatcher.js.map
│   │   ├── constants
│   │   │   ├── config.d.ts
│   │   │   ├── config.d.ts.map
│   │   │   ├── config.js
│   │   │   ├── config.js.map
│   │   │   ├── errors.d.ts
│   │   │   ├── errors.d.ts.map
│   │   │   ├── errors.js
│   │   │   ├── errors.js.map
│   │   │   ├── messages.d.ts
│   │   │   ├── messages.d.ts.map
│   │   │   ├── messages.js
│   │   │   ├── messages.js.map
│   │   │   ├── roles.d.ts
│   │   │   ├── roles.d.ts.map
│   │   │   ├── roles.js
│   │   │   ├── roles.js.map
│   │   │   ├── routes-documentation.d.ts
│   │   │   ├── routes-documentation.d.ts.map
│   │   │   ├── routes-documentation.js
│   │   │   └── routes-documentation.js.map
│   │   ├── events
│   │   │   ├── system-events.d.ts
│   │   │   ├── system-events.d.ts.map
│   │   │   ├── system-events.js
│   │   │   └── system-events.js.map
│   │   ├── types
│   │   │   ├── api.types.d.ts
│   │   │   ├── api.types.d.ts.map
│   │   │   ├── api.types.js
│   │   │   ├── api.types.js.map
│   │   │   ├── common.types.d.ts
│   │   │   ├── common.types.d.ts.map
│   │   │   ├── common.types.js
│   │   │   ├── common.types.js.map
│   │   │   ├── pagination.types.d.ts
│   │   │   ├── pagination.types.d.ts.map
│   │   │   ├── pagination.types.js
│   │   │   └── pagination.types.js.map
│   │   └── utils
│   │       ├── helpers.d.ts
│   │       ├── helpers.d.ts.map
│   │       ├── helpers.js
│   │       ├── helpers.js.map
│   │       ├── logger.d.ts
│   │       ├── logger.d.ts.map
│   │       ├── logger.js
│   │       ├── logger.js.map
│   │       ├── string.utils.d.ts
│   │       ├── string.utils.d.ts.map
│   │       ├── string.utils.js
│   │       ├── string.utils.js.map
│   │       ├── uuid.d.ts
│   │       ├── uuid.d.ts.map
│   │       ├── uuid.js
│   │       ├── uuid.js.map
│   │       ├── validators.d.ts
│   │       ├── validators.d.ts.map
│   │       ├── validators.js
│   │       └── validators.js.map
│   └── types
│       ├── auth.d.ts
│       ├── auth.d.ts.map
│       ├── auth.js
│       ├── auth.js.map
│       ├── guards.d.ts
│       ├── guards.d.ts.map
│       ├── guards.js
│       ├── guards.js.map
│       ├── nucleo.types.d.ts
│       ├── nucleo.types.d.ts.map
│       ├── nucleo.types.js
│       └── nucleo.types.js.map
├── docker-compose.prod.yml
├── docker-compose.yml
├── jest.config.json
├── logs
├── package-lock.json
├── package.json
├── postman
│   ├── collections
│   │   ├── API Documentation #reference
│   │   │   ├── Collections
│   │   │   │   ├── Create a collection.request.yaml
│   │   │   │   ├── Delete a collection.request.yaml
│   │   │   │   ├── Get a collection.request.yaml
│   │   │   │   ├── Get all collections.request.yaml
│   │   │   │   └── Update a collection.request.yaml
│   │   │   └── User
│   │   │       └── Get authenticated user.request.yaml
│   │   └── RESTful API Basics #blueprint
│   │       ├── Delete data.request.yaml
│   │       ├── Get data.request.yaml
│   │       ├── Post data.request.yaml
│   │       └── Update data.request.yaml
│   ├── environments
│   │   └── Beta.environment.yaml
│   ├── flows
│   ├── globals
│   │   └── workspace.globals.yaml
│   ├── mocks
│   ├── sdks
│   └── specs
├── scripts
│   ├── docker-clean.sh
│   └── docker-dev.sh
├── src
│   ├── __test__
│   │   └── domain.test.ts
│   ├── api
│   │   ├── controllers
│   │   │   ├── HealthController.ts
│   │   │   └── v1
│   │   │       ├── AdminController.ts
│   │   │       ├── AuthController.ts
│   │   │       ├── BlocosController.ts
│   │   │       ├── CalendarioController.ts
│   │   │       ├── ColecoesController.ts
│   │   │       ├── GamificacaoController.ts
│   │   │       ├── HabitosController.ts
│   │   │       ├── InsightsController.ts
│   │   │       ├── InsightsControllers.ts
│   │   │       ├── ListasController.ts
│   │   │       ├── NotificationsController.ts
│   │   │       ├── NucleosController.ts
│   │   │       ├── PlansController.ts
│   │   │       ├── ProgressController.ts
│   │   │       ├── TarefasController.ts
│   │   │       ├── TimersController.ts
│   │   │       └── UsersController.ts
│   │   ├── middlewares
│   │   │   ├── auth.middleware.ts
│   │   │   ├── case-converter.ts
│   │   │   ├── error-handler.middleware.ts
│   │   │   ├── normalize-body.middleware.ts
│   │   │   ├── rate-limiter.middleware.ts
│   │   │   ├── request-logger.middleware.ts
│   │   │   └── validation.middleware.ts
│   │   ├── routes
│   │   │   ├── admin.routes.ts
│   │   │   ├── auth.routes.ts
│   │   │   ├── blocos.routes.ts
│   │   │   ├── calendario.routes.ts
│   │   │   ├── colecoes.routes.ts
│   │   │   ├── gamificacao.routes.ts
│   │   │   ├── habitos.routes.ts
│   │   │   ├── index.ts
│   │   │   ├── listas.routes.ts
│   │   │   ├── notifications.routes.ts
│   │   │   ├── nucleos.routes.ts
│   │   │   ├── plan.routes.ts
│   │   │   ├── progress.routes.ts
│   │   │   ├── route-interface.ts
│   │   │   ├── tarefas.routes.ts
│   │   │   ├── timers.routes.ts
│   │   │   └── users.routes.ts
│   │   ├── server.ts
│   │   ├── socket
│   │   │   ├── handles.ts
│   │   │   ├── index.ts
│   │   │   └── middleware.ts
│   │   └── validators
│   │       ├── auth.validator.ts
│   │       ├── habito.validator.ts
│   │       ├── nucleo.validator.ts
│   │       └── tarefa.validator.ts
│   ├── application
│   │   ├── behaviors
│   │   │   ├── LoggingBehavior.ts
│   │   │   ├── TransactionBehavior.ts
│   │   │   └── ValidationBehavior.ts
│   │   ├── commands
│   │   │   ├── auth
│   │   │   │   ├── LoginCommand.ts
│   │   │   │   ├── LoginHandler.ts
│   │   │   │   ├── RegisterCommand.ts
│   │   │   │   └── RegisterHandler.ts
│   │   │   ├── blocos
│   │   │   │   ├── CreateBlocoCommand.ts
│   │   │   │   ├── CreateBlocoHandler.ts
│   │   │   │   ├── DeleteBlocoCommand.ts
│   │   │   │   ├── DeleteBlocoHandler.ts
│   │   │   │   ├── ReorderBlocosCommand.ts
│   │   │   │   ├── ReorderBlocosHandler.ts
│   │   │   │   ├── UpdateBlocoCommand.ts
│   │   │   │   └── UpdateBlocoHandler.ts
│   │   │   ├── calendario
│   │   │   │   ├── CreateEventoCommand.ts
│   │   │   │   ├── CreateEventoHandler.ts
│   │   │   │   ├── DeleteEventoCommand.ts
│   │   │   │   ├── DeleteEventoHandler.ts
│   │   │   │   ├── UpdateEventoCommand.ts
│   │   │   │   └── UpdateEventoHandler.ts
│   │   │   ├── colecoes
│   │   │   │   ├── CreateCampoCommand.ts
│   │   │   │   ├── CreateCampoHandler.ts
│   │   │   │   ├── CreateColecaoCommand.ts
│   │   │   │   ├── CreateColecaoHandler.ts
│   │   │   │   ├── CreateItemCommand.ts
│   │   │   │   ├── CreateItemHandler.ts
│   │   │   │   ├── DeleteCampoCommand.ts
│   │   │   │   ├── DeleteCampoHandler.ts
│   │   │   │   ├── DeleteColecaoCommand.ts
│   │   │   │   ├── DeleteColecaoHandler.ts
│   │   │   │   ├── DeleteItemCommand.ts
│   │   │   │   ├── DeleteItemHandler.ts
│   │   │   │   ├── UpdateCampoCommand.ts
│   │   │   │   ├── UpdateCampoHandler.ts
│   │   │   │   ├── UpdateColecaoCommand.ts
│   │   │   │   ├── UpdateColecaoHandler.ts
│   │   │   │   ├── UpdateItemCommand.ts
│   │   │   │   └── UpdateItemHandler.ts
│   │   │   ├── habitos
│   │   │   │   ├── CreateHabitoCommand.ts
│   │   │   │   ├── CreateHabitoHandler.ts
│   │   │   │   ├── DeleteHabitoCommand.ts
│   │   │   │   ├── DeleteHabitoHandler.ts
│   │   │   │   ├── RegistrarHabitoCommand.ts
│   │   │   │   ├── RegistrarHabitoHandler.ts
│   │   │   │   ├── UpdateHabitoCommand.ts
│   │   │   │   └── UpdateHabitoHandler.ts
│   │   │   ├── listas
│   │   │   │   ├── CreateCategoriaCommand.ts
│   │   │   │   ├── CreateCategoriaHandler.ts
│   │   │   │   ├── CreateItemListaCommand.ts
│   │   │   │   ├── CreateItemListaHandler.ts
│   │   │   │   ├── CreateListaCommand.ts
│   │   │   │   ├── CreateListaHandler.ts
│   │   │   │   ├── DeleteCategoriaCommand.ts
│   │   │   │   ├── DeleteCategoriaHandler.ts
│   │   │   │   ├── DeleteItemListaCommand.ts
│   │   │   │   ├── DeleteItemListaHandler.ts
│   │   │   │   ├── DeleteListaCommand.ts
│   │   │   │   ├── DeleteListaHandler.ts
│   │   │   │   ├── GetItemsByListaQuery.ts
│   │   │   │   ├── ToggleItemCheckedCommand.ts
│   │   │   │   ├── ToggleItemCheckedHandler.ts
│   │   │   │   ├── ToggleItemCommand.ts
│   │   │   │   ├── UpdateItemListaCommand.ts
│   │   │   │   ├── UpdateItemListaHandler.ts
│   │   │   │   ├── UpdateListaCommand.ts
│   │   │   │   └── UpdateListaHandler.ts
│   │   │   ├── nucleos
│   │   │   │   ├── CreateNucleoCommand.ts
│   │   │   │   ├── CreateNucleoHandler.ts
│   │   │   │   ├── DeleteNucleoCommand.ts
│   │   │   │   ├── DeleteNucleoHandler.ts
│   │   │   │   ├── ShareNucleoCommand.ts
│   │   │   │   ├── UpdateNucleoCommand.ts
│   │   │   │   └── UpdateNucleoHandler.ts
│   │   │   ├── tarefas
│   │   │   │   ├── ConcluirTarefaCommand.ts
│   │   │   │   ├── ConcluirTarefaHandler.ts
│   │   │   │   ├── CreateTarefaCommand.ts
│   │   │   │   ├── CreateTarefaHandler.ts
│   │   │   │   ├── DeleteTarefaCommand.ts
│   │   │   │   └── DeleteTarefaHandler.ts
│   │   │   └── timers
│   │   │       ├── delete-timer.command.ts
│   │   │       ├── delete-timer.handler.ts
│   │   │       ├── start-timer.command.ts
│   │   │       ├── start-timer.handler.ts
│   │   │       ├── stop-timer.command.ts
│   │   │       ├── stop-timer.handler.ts
│   │   │       ├── update-timer.command.ts
│   │   │       └── update-timer.handler.ts
│   │   ├── common
│   │   │   ├── exceptions
│   │   │   │   ├── bad-request.exception.ts
│   │   │   │   ├── business-rule.exception.ts
│   │   │   │   ├── conflict.exception.ts
│   │   │   │   ├── forbidden.exception.ts
│   │   │   │   ├── not-found.exception.ts
│   │   │   │   ├── unauthorized.exception.ts
│   │   │   │   └── validation.exception.ts
│   │   │   └── mediator
│   │   │       └── mediator.ts
│   │   ├── dto
│   │   │   ├── admin.dto.ts
│   │   │   ├── api-response.dto.ts
│   │   │   ├── auth-response.dto.ts
│   │   │   ├── auth.dto.ts
│   │   │   ├── bloco.dto.ts
│   │   │   ├── calendario.dto.ts
│   │   │   ├── colecao.dto.ts
│   │   │   ├── gamificacao.dto.ts
│   │   │   ├── habito.dto.ts
│   │   │   ├── insight.dto.ts
│   │   │   ├── lista.dto.ts
│   │   │   ├── notification.dto.ts
│   │   │   ├── nucleo.dto.ts
│   │   │   ├── tarefa.dto.ts
│   │   │   ├── timer.dto.ts
│   │   │   └── user-dto.ts
│   │   ├── interfaces
│   │   │   ├── ICurrentUserService.ts
│   │   │   ├── IDateTimeProvider.ts
│   │   │   ├── IEmailService.ts
│   │   │   ├── IJwtService.ts
│   │   │   └── IUnitOfWork.ts
│   │   ├── listeners
│   │   │   └── GamificationEventListener.ts
│   │   ├── mappings
│   │   │   ├── nucleo.mapping.ts
│   │   │   ├── tarefa.mapping.ts
│   │   │   └── user.mapping.ts
│   │   └── queries
│   │       ├── auth
│   │       │   ├── GetCurrentUserQuery.ts
│   │       │   ├── get-current-user.handler.ts
│   │       │   └── get-current-user.query.ts
│   │       ├── blocos
│   │       │   ├── GetBlocoByIdHandler.ts
│   │       │   ├── GetBlocoByIdQuery.ts
│   │       │   ├── GetBlocosByNucleoHandler.ts
│   │       │   └── GetBlocosByNucleoQuery.ts
│   │       ├── calendario
│   │       │   ├── GetEventoByIdHandler.ts
│   │       │   ├── GetEventoByIdQuery.ts
│   │       │   ├── GetEventosByNucleoHandler.ts
│   │       │   └── GetEventosByNucleoQuery.ts
│   │       ├── colecoes
│   │       │   ├── GetCamposByColecaoHandler.ts
│   │       │   ├── GetCamposByColecaoQuery.ts
│   │       │   ├── GetColecaoByIdHandler.ts
│   │       │   ├── GetColecaoByIdQuery.ts
│   │       │   ├── GetColecoesByBlocoHandler.ts
│   │       │   ├── GetColecoesByBlocoQuery.ts
│   │       │   ├── GetItemsByColecaoHandler.ts
│   │       │   └── GetItemsByColecaoQuery.ts
│   │       ├── gamificacao
│   │       │   ├── GetUserConquistasQuery.ts
│   │       │   ├── GetUserStreaksQuery.ts
│   │       │   ├── get-user-level.handler.ts
│   │       │   └── get-user-level.query.ts
│   │       ├── habitos
│   │       │   ├── GetHabitosByBlocoHandler.ts
│   │       │   └── GetHabitosByBlocoQuery.ts
│   │       ├── listas
│   │       │   ├── GetCategoriasByListaHandler.ts
│   │       │   ├── GetCategoriasByListaQuery.ts
│   │       │   ├── GetItemsByListaHandler.ts
│   │       │   ├── GetItemsByListaQuery.ts
│   │       │   ├── GetListaByIdHandler.ts
│   │       │   ├── GetListaByIdQuery.ts
│   │       │   ├── GetListasByBlocoHandler.ts
│   │       │   └── GetListasByBlocoQuery.ts
│   │       ├── nucleos
│   │       │   ├── GetNucleoByIdHandler.ts
│   │       │   ├── GetNucleoByIdQuery.ts
│   │       │   ├── GetNucleosHandler.ts
│   │       │   └── GetNucleosQuery.ts
│   │       ├── tarefas
│   │       │   ├── GetTarefasByBlocoHandler.ts
│   │       │   ├── GetTarefasByBlocoQuery.ts
│   │       │   ├── GetTarefasVencendoHandler.ts
│   │       │   └── GetTarefasVencendoQuery.ts
│   │       └── timers
│   │           ├── get-timers-by-nucleo.handler.ts
│   │           └── get-timers-by-nucleo.query.ts
│   ├── config
│   │   ├── database.ts
│   │   ├── di-container.ts
│   │   └── env.ts
│   ├── domain
│   │   ├── entities
│   │   │   ├── AIContext.ts
│   │   │   ├── AIInsight.ts
│   │   │   ├── AIInteraction.ts
│   │   │   ├── ActivityLog.ts
│   │   │   ├── Bloco.ts
│   │   │   ├── BlocoCalculo.ts
│   │   │   ├── CalendarioEvento.ts
│   │   │   ├── Campo.ts
│   │   │   ├── Categoria.ts
│   │   │   ├── Colecao.ts
│   │   │   ├── Conquista.ts
│   │   │   ├── EnergyLog.ts
│   │   │   ├── Habito.ts
│   │   │   ├── HabitoRegistro.ts
│   │   │   ├── Item.ts
│   │   │   ├── ItemLista.ts
│   │   │   ├── ItemValor.ts
│   │   │   ├── Lista.ts
│   │   │   ├── Meta.ts
│   │   │   ├── Notification.ts
│   │   │   ├── Nucleo.ts
│   │   │   ├── NucleoAchievement.ts
│   │   │   ├── NucleoCompartilhamento.ts
│   │   │   ├── NucleoIcon.ts
│   │   │   ├── NucleoRelation.ts
│   │   │   ├── NucleoTimer.ts
│   │   │   ├── PasswordReset.ts
│   │   │   ├── Plan.ts
│   │   │   ├── Streak.ts
│   │   │   ├── Subscription.ts
│   │   │   ├── Tarefa.ts
│   │   │   ├── Timer.ts
│   │   │   ├── User.ts
│   │   │   ├── UserConquista.ts
│   │   │   ├── UserLevel.ts
│   │   │   ├── UserPreference.ts
│   │   │   ├── UserProfile.ts
│   │   │   ├── UserRole.ts
│   │   │   ├── UserSecurity.ts
│   │   │   ├── XpLog.ts
│   │   │   └── base.entity.ts
│   │   ├── enums
│   │   │   ├── AchievementType.ts
│   │   │   ├── InsightType.ts
│   │   │   ├── UserRoleEnum.ts
│   │   │   ├── tipo-bloco.enum.ts
│   │   │   └── tipo-nucleo.enum.ts
│   │   ├── events
│   │   │   ├── BlocoCriadoEvent.ts
│   │   │   ├── HabitoRegistradoEvent.ts
│   │   │   ├── ItemListaCheckedEvent.ts
│   │   │   ├── NivelAlcancadoEvent.ts
│   │   │   ├── NucleoCriadoEvent.ts
│   │   │   ├── TarefaConcluidaEvent.ts
│   │   │   ├── TimerCompletadoEvent.ts
│   │   │   ├── UserLoginEvent.ts
│   │   │   └── XPGanhoEvent.ts
│   │   ├── exceptions
│   │   │   ├── BusinessRuleException.ts
│   │   │   ├── DomainException.ts
│   │   │   ├── NotFoundException.ts
│   │   │   └── UnauthorizedException.ts
│   │   ├── repositories
│   │   │   ├── IBlocoRepository.ts
│   │   │   ├── ICalendarioRepository.ts
│   │   │   ├── IColecaoRepository.ts
│   │   │   ├── IConquistaRepository.ts
│   │   │   ├── IHabitoRepository.ts
│   │   │   ├── IListaRepository.ts
│   │   │   ├── INucleoRepository.ts
│   │   │   ├── IStreakRepository.ts
│   │   │   ├── ITarefaRepository.ts
│   │   │   ├── IUserLevelRepository.ts
│   │   │   └── IUserRepository.ts
│   │   ├── services
│   │   │   ├── GamificacaoDomainService.ts
│   │   │   ├── HabitoDomainService.ts
│   │   │   ├── NucleoDomainService.ts
│   │   │   ├── StreakDomainService.ts
│   │   │   ├── TarefaDomainService.ts
│   │   │   └── XPDomainService.ts
│   │   └── value-objects
│   │       ├── CPF.ts
│   │       ├── Email.ts
│   │       ├── FrequenciaHabito.ts
│   │       ├── PermissionLevel.ts
│   │       ├── PrioridadeTarefa.ts
│   │       ├── StatusTarefa.ts
│   │       ├── TipoBloco.ts
│   │       ├── TipoLista.ts
│   │       └── TipoNucleo.ts
│   ├── infrastructure
│   │   ├── cache
│   │   │   ├── cache.service.ts
│   │   │   └── redis.service.ts
│   │   ├── di
│   │   │   ├── container.ts
│   │   │   └── timer-handlers.registry.ts
│   │   ├── gamification
│   │   │   └── index.ts
│   │   ├── persistence
│   │   │   ├── db
│   │   │   │   ├── connection.ts
│   │   │   │   ├── query-builder.ts
│   │   │   │   ├── supabase.ts
│   │   │   │   └── unit-of-work.ts
│   │   │   ├── migrations
│   │   │   │   ├── 001_create_users.sql
│   │   │   │   ├── 002_create_nucleos.sql
│   │   │   │   ├── 003_create_blocos.sql
│   │   │   │   ├── 004_create_tarefas.sql
│   │   │   │   ├── 005_create_habitos.sql
│   │   │   │   ├── 006_create_listas.sql
│   │   │   │   ├── 007_create_colecoes.sql
│   │   │   │   ├── 008_create_gamificacao.sql
│   │   │   │   └── 009_create_ai.sql
│   │   │   ├── repositories
│   │   │   │   ├── BaseRepository.ts
│   │   │   │   ├── BlocoRepository.ts
│   │   │   │   ├── CalendarioRepository.ts
│   │   │   │   ├── ColecaoRepository.ts
│   │   │   │   ├── ConquistaRepository.ts
│   │   │   │   ├── HabitoRepository.ts
│   │   │   │   ├── ListaRepository.ts
│   │   │   │   ├── NucleoIconRepository.ts
│   │   │   │   ├── NucleoRepository.ts
│   │   │   │   ├── StreakRepository.ts
│   │   │   │   ├── TarefaRepository.ts
│   │   │   │   ├── TimerRepository.ts
│   │   │   │   ├── UserLevelRepository.ts
│   │   │   │   ├── UserRepository.ts
│   │   │   │   └── XpLogRepository.ts
│   │   │   └── seed
│   │   │       ├── seed-conquistas.ts
│   │   │       └── seed-plans.ts
│   │   ├── queue
│   │   │   ├── bull.service.ts
│   │   │   └── queue.service.ts
│   │   └── services
│   │       ├── GamificationService.ts
│   │       ├── LevelService.ts
│   │       ├── StreakDomainService.ts
│   │       ├── XPDomainService.ts
│   │       ├── bcrypt.service.ts
│   │       ├── current-user.service.ts
│   │       ├── date-time.provider.ts
│   │       ├── email.service.ts
│   │       ├── jwt.service.ts
│   │       ├── openai.service.ts
│   │       └── storage.service.ts
│   ├── jobs
│   │   ├── calculate-streaks.job.ts
│   │   ├── generate-insights.job.ts
│   │   ├── index.ts
│   │   └── send-notifications.job.ts
│   ├── shared
│   │   ├── EventDispatcher.ts
│   │   ├── constants
│   │   │   ├── config.ts
│   │   │   ├── errors.ts
│   │   │   ├── messages.ts
│   │   │   ├── roles.ts
│   │   │   └── routes-documentation.ts
│   │   ├── decorators
│   │   ├── events
│   │   │   └── system-events.ts
│   │   ├── types
│   │   │   ├── api.types.ts
│   │   │   ├── common.types.ts
│   │   │   └── pagination.types.ts
│   │   └── utils
│   │       ├── helpers.ts
│   │       ├── logger.ts
│   │       ├── string.utils.ts
│   │       ├── uuid.ts
│   │       └── validators.ts
│   └── types
│       ├── auth.ts
│       ├── connect-timeout.d.ts
│       ├── express
│       │   └── index.d.ts
│       ├── guards.ts
│       └── nucleo.types.ts
├── tests
│   ├── integration
│   │   ├── database.test.ts
│   │   └── repositories.test.ts
│   ├── setup.ts
│   └── unit
│       ├── api
│       │   └── auth.test.ts
│       ├── application
│       │   ├── ConcluirTarefa.test.ts
│       │   └── CreateNucleo.test.ts
│       └── domain
│           ├── Habito.test.ts
│           ├── Nucleo.test.ts
│           └── Tarefa.test.ts
├── tsconfig.json
└── uploads

//  então ao rodar todos os comandos no SQLEditor necessários, quais arquivos no front-end preciso mudar tb? veja a estrutura e me manda a lista de arquivos que eu preciso de mandar pra vc corrigir/adaptar 