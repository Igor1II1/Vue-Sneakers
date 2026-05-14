# Инструкция по развёртыванию

## Требования

- Docker Desktop с включённым Kubernetes
- kubectl (устанавливается вместе с Docker Desktop)

## Как включить Kubernetes в Docker Desktop

1. Открой Docker Desktop
2. Settings → Kubernetes → Enable Kubernetes
3. Apply & Restart
4. Дождись зелёного статуса Running

## Запуск проекта

```bash
git clone https://github.com/Igor1II1/vue-sneakers.git
cd vue-sneakers
kubectl apply -f k8s/
```

Подождать 1-2 минуты пока поды запустятся:

```bash
kubectl get pods
```

Все поды должны быть в статусе `Running`:

```
NAME                        READY   STATUS    RESTARTS   AGE
app-xxxxxxxxx-xxxxx         1/1     Running   0          1m
app-xxxxxxxxx-xxxxx         1/1     Running   0          1m
db-xxxxxxxxx-xxxxx          1/1     Running   0          1m
frontend-xxxxxxxxx-xxxxx    1/1     Running   0          1m
```

Открыть в браузере: **http://localhost:30080**

## Демонстрация самовосстановления

Kubernetes автоматически перезапускает упавшие контейнеры. Чтобы показать это:

```bash
# Посмотреть имена подов
kubectl get pods

# Удалить один из app-подов
kubectl delete pod app-xxxxxxxxx-xxxxx

# Сразу проверить — Kubernetes уже создаёт новый
kubectl get pods
```

Старый под исчезнет и появится новый с другим именем. Приложение при этом продолжает работать через вторую реплику.
